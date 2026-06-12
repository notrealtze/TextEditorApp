import React, {useState, useRef} from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StatusBar, StyleSheet, Animated
} from 'react-native';
const C = {
  bg:          '#000000',  
  editor:      '#030303',  
  tabBar:      '#0A0A0A',  
  tabInactive: '#0D0D0D',
  border:      '#1C1C1C',  
  accent:      '#4FC3F7',  
  accentDim:   '#1A3A4A',  
  text:        '#DEDEDE',  
  textDim:     '#505050',  
  statusBg:    '#020202',
  surface:     '#080808',  
};
export default function App() {
  const [tabs, setTabs] = useState([{name: 'untitled.txt', content: ''}]);
  const [active, setActive] = useState(0);
  const [text, setText] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const flashInfo = () => {
    setShowInfo(true);
    Animated.sequence([
      Animated.timing(fadeAnim, {toValue: 1, duration: 120, useNativeDriver: true}),
      Animated.delay(1200),
      Animated.timing(fadeAnim, {toValue: 0, duration: 300, useNativeDriver: true}),
    ]).start(() => setShowInfo(false));
  };
  const saveAndSwitch = (index) => {
    const updated = [...tabs];
    updated[active].content = text;
    setTabs(updated);
    setActive(index);
    setText(updated[index].content);
  };
  const newTab = () => {
    const updated = [...tabs];
    updated[active].content = text;
    const next = [...updated, {name: 'untitled.txt', content: ''}];
    setTabs(next);
    setActive(next.length - 1);
    setText('');
  };
  const closeTab = (i) => {
    if (tabs.length === 1) return;
    const next = tabs.filter((_, idx) => idx !== i);
    setTabs(next);
    const nextIdx = i >= next.length ? next.length - 1 : i;
    setActive(nextIdx);
    setText(next[nextIdx].content);
  };
  const clearEditor = () => {
    setText('');
    flashInfo();
  };
  const lines = text.split('\n');
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const col = text.length - text.lastIndexOf('\n') - 1;
  return (
    <View style={s.root}>
      <StatusBar backgroundColor={C.bg} barStyle="light-content" />
      <View style={s.titleBar}>
        <View style={s.titleLeft}>
          <View style={s.titleDot} />
          <Text style={s.titleText}>EDIT</Text>
        </View>
        <Text style={s.titleMeta}>
          {lines.length} ln · {wordCount} wd · {text.length} ch
        </Text>
      </View>
      <View style={s.tabStrip}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab, i) => (
            <TouchableOpacity
              key={i}
              style={[s.tab, i === active && s.tabActive]}
              onPress={() => saveAndSwitch(i)}
              activeOpacity={0.7}
            >
              {i === active && <View style={s.tabAccentBar} />}
              <Text style={[s.tabText, i === active && s.tabTextActive]}>
                {tab.name}
              </Text>
              {tabs.length > 1 && (
                <TouchableOpacity
                  onPress={() => closeTab(i)}
                  style={s.tabClose}
                  hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
                >
                  <Text style={s.tabCloseText}>×</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={s.tabNew} onPress={newTab}>
            <Text style={s.tabNewText}>+</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <View style={s.editorRow}>
        <View style={s.gutterWrap}>
          <ScrollView scrollEnabled={false} showsVerticalScrollIndicator={false}>
            {lines.map((_, i) => (
              <Text key={i} style={s.gutterNum}>
                {i + 1}
              </Text>
            ))}
          </ScrollView>
        </View>
        <TextInput
          style={s.editor}
          multiline
          value={text}
          onChangeText={setText}
          placeholder="
          placeholderTextColor={C.textDim}
          textAlignVertical="top"
          autoCorrect={false}
          autoCapitalize="none"
          spellCheck={false}
          selectionColor={C.accent}
          cursorColor={C.accent}
        />
      </View>
      {showInfo && (
        <Animated.View style={[s.toast, {opacity: fadeAnim}]}>
          <Text style={s.toastText}>cleared</Text>
        </Animated.View>
      )}
      <View style={s.actionBar}>
        {[
          {label: 'NEW',   fn: newTab},
          {label: 'OPEN',  fn: () => {}},
          {label: 'SAVE',  fn: () => {}},
          {label: 'CLEAR', fn: clearEditor},
        ].map(({label, fn}) => (
          <TouchableOpacity key={label} style={s.actionBtn} onPress={fn} activeOpacity={0.6}>
            <Text style={s.actionText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={s.statusBar}>
        <Text style={s.statusLeft}>
          <Text style={{color: C.accent}}>▸ </Text>UTF-8  plain text
        </Text>
        <Text style={s.statusRight}>
          Ln {lines.length}  Col {col < 0 ? 0 : col}
        </Text>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  titleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: C.bg,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.accent,
  },
  titleText: {
    color: C.text,
    fontFamily: 'monospace',
    fontSize: 12,
    letterSpacing: 3,
    fontWeight: '700',
  },
  titleMeta: {
    color: C.textDim,
    fontFamily: 'monospace',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  tabStrip: {
    backgroundColor: C.tabBar,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: C.tabInactive,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: C.border,
    position: 'relative',
  },
  tabActive: {
    backgroundColor: C.bg,
  },
  tabAccentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: C.accent,
  },
  tabText: {
    color: C.textDim,
    fontFamily: 'monospace',
    fontSize: 12,
  },
  tabTextActive: {
    color: C.text,
  },
  tabClose: {
    marginLeft: 10,
  },
  tabCloseText: {
    color: C.textDim,
    fontSize: 15,
    lineHeight: 17,
  },
  tabNew: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabNewText: {
    color: C.accent,
    fontSize: 20,
    fontWeight: '200',
    lineHeight: 24,
  },
  editorRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: C.editor,
  },
  gutterWrap: {
    backgroundColor: C.bg,
    paddingTop: 14,
    paddingHorizontal: 10,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: C.border,
    minWidth: 42,
    alignItems: 'flex-end',
  },
  gutterNum: {
    color: C.textDim,
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 22,
  },
  editor: {
    flex: 1,
    color: C.text,
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 22,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: C.editor,
  },
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 100,
    backgroundColor: C.accentDim,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.accent,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 2,
  },
  toastText: {
    color: C.accent,
    fontFamily: 'monospace',
    fontSize: 12,
    letterSpacing: 1,
  },
  actionBar: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.border,
    paddingVertical: 2,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 13,
  },
  actionText: {
    color: C.textDim,
    fontFamily: 'monospace',
    fontSize: 11,
    letterSpacing: 1.5,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: C.statusBg,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.border,
  },
  statusLeft: {
    color: C.textDim,
    fontFamily: 'monospace',
    fontSize: 11,
  },
  statusRight: {
    color: C.textDim,
    fontFamily: 'monospace',
    fontSize: 11,
  },
});
