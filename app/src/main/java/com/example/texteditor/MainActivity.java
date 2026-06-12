package com.example.texteditor;
import android.Manifest;
import android.app.AlertDialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.EditText;
import android.widget.HorizontalScrollView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.documentfile.provider.DocumentFile;
import java.io.*;
import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {

    private EditText editText;
    private LinearLayout tabBar;
    private ArrayList<String> tabContents = new ArrayList<>();
    private ArrayList<String> tabNames = new ArrayList<>();
    private int currentTab = 0;
    private static final int REQUEST_PERMISSION = 1;
    private static final int REQUEST_SAVE_DIR = 2;
    private static final int REQUEST_OPEN_FILE = 3;
    private Uri saveDirectoryUri = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(0xFF1E1E1E);

        // Tab bar
        HorizontalScrollView tabScroll = new HorizontalScrollView(this);
        tabBar = new LinearLayout(this);
        tabBar.setOrientation(LinearLayout.HORIZONTAL);
        tabBar.setBackgroundColor(0xFF252526);
        tabScroll.addView(tabBar);
        root.addView(tabScroll);

        // Editor
        editText = new EditText(this);
        editText.setBackgroundColor(0xFF1E1E1E);
        editText.setTextColor(0xFFD4D4D4);
        editText.setHintTextColor(0xFF6A6A6A);
        editText.setHint("Start typing...");
        editText.setTextSize(15);
        editText.setGravity(android.view.Gravity.TOP | android.view.Gravity.START);
        editText.setPadding(24, 20, 24, 20);
        editText.setTypeface(android.graphics.Typeface.MONOSPACE);
        LinearLayout.LayoutParams editorParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, 0, 1f);
        editText.setLayoutParams(editorParams);
        root.addView(editText);

        // Bottom toolbar
        LinearLayout toolbar = new LinearLayout(this);
        toolbar.setOrientation(LinearLayout.HORIZONTAL);
        toolbar.setBackgroundColor(0xFF007ACC);
        toolbar.setPadding(8, 8, 8, 8);

        String[] actions = {"New", "Open", "Save", "Save As"};
        for (String action : actions) {
            TextView btn = new TextView(this);
            btn.setText(action);
            btn.setTextColor(0xFFFFFFFF);
            btn.setTextSize(13);
            btn.setPadding(24, 12, 24, 12);
            btn.setBackgroundColor(0xFF005A9E);
            LinearLayout.LayoutParams p = new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f);
            p.setMargins(4, 0, 4, 0);
            btn.setLayoutParams(p);
            btn.setGravity(android.view.Gravity.CENTER);
            btn.setOnClickListener(v -> handleAction(action));
            toolbar.addView(btn);
        }
        root.addView(toolbar);

        setContentView(root);
        requestStoragePermission();
        addNewTab();
    }

    private void handleAction(String action) {
        switch (action) {
            case "New": addNewTab(); break;
            case "Open": openFile(); break;
            case "Save": saveCurrentFile(); break;
            case "Save As": saveAs(); break;
        }
    }

    private void addNewTab() {
        tabContents.add("");
        tabNames.add("untitled");
        currentTab = tabContents.size() - 1;
        refreshTabs();
        editText.setText("");
    }

    private void refreshTabs() {
        tabBar.removeAllViews();
        for (int i = 0; i < tabNames.size(); i++) {
            final int index = i;
            TextView tab = new TextView(this);
            tab.setText("  " + tabNames.get(i) + "  ");
            tab.setTextSize(13);
            tab.setPadding(16, 14, 16, 14);
            if (i == currentTab) {
                tab.setBackgroundColor(0xFF1E1E1E);
                tab.setTextColor(0xFFFFFFFF);
            } else {
                tab.setBackgroundColor(0xFF2D2D2D);
                tab.setTextColor(0xFF9D9D9D);
            }
            tab.setOnClickListener(v -> switchTab(index));
            tabBar.addView(tab);
        }
    }

    private void switchTab(int index) {
        tabContents.set(currentTab, editText.getText().toString());
        currentTab = index;
        editText.setText(tabContents.get(currentTab));
        refreshTabs();
    }

    private void requestStoragePermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            if (!Environment.isExternalStorageManager()) {
                new AlertDialog.Builder(this)
                    .setTitle("Storage Permission")
                    .setMessage("This app needs storage access to open and save files.")
                    .setPositiveButton("Grant", (d, w) -> {
                        Intent intent = new Intent(android.provider.Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);
                        intent.setData(Uri.parse("package:" + getPackageName()));
                        startActivity(intent);
                    })
                    .setNegativeButton("Skip", null)
                    .show();
            }
        } else {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.READ_EXTERNAL_STORAGE,
                                 Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQUEST_PERMISSION);
            }
        }
    }

    private void saveCurrentFile() {
        if (saveDirectoryUri != null) {
            saveToUri();
        } else {
            saveAs();
        }
    }

    private void saveAs() {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
        startActivityForResult(intent, REQUEST_SAVE_DIR);
    }

    private void saveToUri() {
        try {
            DocumentFile dir = DocumentFile.fromTreeUri(this, saveDirectoryUri);
            String name = tabNames.get(currentTab);
            if (name.equals("untitled")) name = "note.txt";
            DocumentFile file = dir.findFile(name);
            if (file == null) file = dir.createFile("text/plain", name);
            OutputStream os = getContentResolver().openOutputStream(file.getUri(), "wt");
            os.write(editText.getText().toString().getBytes());
            os.close();
            Toast.makeText(this, "Saved to " + name, Toast.LENGTH_SHORT).show();
        } catch (Exception e) {
            Toast.makeText(this, "Save failed: " + e.getMessage(), Toast.LENGTH_LONG).show();
        }
    }

    private void openFile() {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("text/*");
        startActivityForResult(intent, REQUEST_OPEN_FILE);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode != RESULT_OK || data == null) return;
        if (requestCode == REQUEST_SAVE_DIR) {
            saveDirectoryUri = data.getData();
            getContentResolver().takePersistableUriPermission(saveDirectoryUri,
                Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
            saveToUri();
        } else if (requestCode == REQUEST_OPEN_FILE) {
            try {
                Uri uri = data.getData();
                InputStream is = getContentResolver().openInputStream(uri);
                BufferedReader reader = new BufferedReader(new InputStreamReader(is));
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) sb.append(line).append("\n");
                reader.close();
                tabContents.add(sb.toString());
                String fileName = uri.getLastPathSegment();
                if (fileName != null && fileName.contains("/"))
                    fileName = fileName.substring(fileName.lastIndexOf("/") + 1);
                tabNames.add(fileName != null ? fileName : "opened");
                currentTab = tabContents.size() - 1;
                editText.setText(tabContents.get(currentTab));
                refreshTabs();
            } catch (Exception e) {
                Toast.makeText(this, "Open failed: " + e.getMessage(), Toast.LENGTH_LONG).show();
            }
        }
    }
}
