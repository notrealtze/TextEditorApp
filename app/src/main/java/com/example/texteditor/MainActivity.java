package com.example.texteditor;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import java.io.*;
public class MainActivity extends AppCompatActivity {
    private EditText editText;
    private File currentFile;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        editText = findViewById(R.id.editText);
        currentFile = new File(getExternalFilesDir(null), "mynote.txt");
        if (currentFile.exists()) {
            try {
                BufferedReader reader = new BufferedReader(new FileReader(currentFile));
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    sb.append(line).append("\n");
                }
                reader.close();
                editText.setText(sb.toString());
            } catch (IOException e) {
                Toast.makeText(this, "Could not load file", Toast.LENGTH_SHORT).show();
            }
        }
    }
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        menu.add(0, 1, 0, "Save");
        menu.add(0, 2, 0, "Clear");
        return true;
    }
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == 1) {
            try {
                FileWriter writer = new FileWriter(currentFile);
                writer.write(editText.getText().toString());
                writer.close();
                Toast.makeText(this, "Saved!", Toast.LENGTH_SHORT).show();
            } catch (IOException e) {
                Toast.makeText(this, "Save failed", Toast.LENGTH_SHORT).show();
            }
        } else if (item.getItemId() == 2) {
            editText.setText("");
        }
        return true;
    }
}
