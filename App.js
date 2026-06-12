import React, {useState} from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StatusBar, StyleSheet
} from 'react-native';

const C = {
  bg:         '#000000',
  editor:     '#080808',
  tabBar:     '#0C0C0C',
  surface:    '#0F0F0F',
  border:     '#1A1A1A',
  accent:     '#4FC3F7',
  text:       '#E2E2E2',
  subtext:    '#333333',
  lineNum:    '#2A2A2A',
  statusBg:   '#050505',
  btnPress:   '#151515',
  tabInactive:'#181818',
};

export default function App() {
  const [tabs, setTabs] = useState([{name: 'untitled.txt', content: ''}]);
  const [active, setActive] = useState(0);
  const [text, setText] = useState('');

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

  const lines = text.split('\n');

  return (
    <View style={s.root}>
      <StatusBar backgroundColor={C.bg} barStyle="light-content"/>
      <View style={s.titleBar}>
        <Text style={s.titleLeft}>&#x25A0; TextEditor</Text>
        <Text style={s.titleRight}>{lines.length}L  {text.length}C</Text>
      </View>
      <View style={s.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.tabScroll}>
          {tabs.map((tab, i) => (
            <TouchableOpacity key={i}
              style={[s.tab, i === active && s.tabActive]}
              onPress={() => saveAndSwitch(i)}>
              <View style={[s.tabIndicator, i === active && s.tabIndicatorActive]}/>
              <Text style={[s.tabText, i === active && s.tabTextActive]}>
                {tab.name}
              </Text>
              <TouchableOpacity onPress={() => closeTab(i)} style={s.closeWrap}>
                <Text style={s.closeText}>x</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={s.addTab} onPress={newTab}>
            <Text style={s.addTabText}>+</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <View style={s.editorWrap}>
        <ScrollView style={s.lineNumbers} scrollEnabled={false}>
          {lines.map((_, i) => (
            <Text key={i} style={s.lineNum}>
              {String(i + 1).padStart(3, ' ')}
            </Text>
          ))}
        </ScrollView>
        <TextInput
          style={s.editor}
          multiline
          value={text}
          onChangeText={setText}
          placeholder={'// start typing'}
          placeholderTextColor={C.subtext}
          textAlignVertical="top"
          autoCorrect={false}
          autoCapitalize="none"
          spellCheck={false}
          selectionColor={C.accent}
        />
      </View>
      <View style={s.toolbar}>
        {['New', 'Open', 'Save', 'Find', 'Undo', 'Redo'].map(action => (
          <TouchableOpacity key={action} style={s.toolBtn} activeOpacity={0.6}>
            <Text style={s.toolText}>{action}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={s.statusBar}>
        <Text style={s.statusLeft}>UTF-8  ·  Plain Text</Text>
        <Text style={s.statusRight}>Ln {lines.length}  Col {text.length - text.lastIndexOf('\n') - 1}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root:               {flex:1, backgroundColor:C.bg},
  titleBar:           {flexDirection:'row', justifyContent:'space-between',
                       alignItems:'center', backgroundColor:C.bg,
                       paddingHorizontal:14, paddingVertical:9,
                       borderBottomWidth:1, borderBottomColor:C.border},
  titleLeft:          {color:C.accent, fontFamily:'monospace', fontSize:13, letterSpacing:1},
  titleRight:         {color:C.subtext, fontFamily:'monospace', fontSize:11},
  tabBar:             {backgroundColor:C.tabBar, borderBottomWidth:1, borderBottomColor:C.border},
  tabScroll:          {alignItems:'stretch'},
  tab:                {flexDirection:'row', alignItems:'center',
                       backgroundColor:C.tabInactive, paddingHorizontal:12,
                       paddingVertical:10, borderRightWidth:1, borderRightColor:C.border},
  tabActive:          {backgroundColor:C.bg},
  tabIndicator:       {width:2, height:'100%', position:'absolute',
                       left:0, top:0, backgroundColor:'transparent'},
  tabIndicatorActive: {backgroundColor:C.accent},
  tabText:            {color:C.subtext, fontFamily:'monospace', fontSize:12},
  tabTextActive:      {color:C.text},
  closeWrap:          {marginLeft:10, padding:2},
  closeText:          {color:C.subtext, fontSize:16, lineHeight:18},
  addTab:             {paddingHorizontal:14, justifyContent:'center', alignItems:'center'},
  addTabText:         {color:C.accent, fontSize:22, fontWeight:'200'},
  editorWrap:         {flex:1, flexDirection:'row', backgroundColor:C.editor},
  lineNumbers:        {backgroundColor:C.bg, paddingTop:12, paddingHorizontal:6,
                       borderRightWidth:1, borderRightColor:C.border},
  lineNum:            {color:C.lineNum, fontFamily:'monospace', fontSize:13,
                       lineHeight:21, textAlign:'right'},
  editor:             {flex:1, color:C.text, fontFamily:'monospace',
                       fontSize:13, lineHeight:21, padding:12, backgroundColor:C.editor},
  toolbar:            {flexDirection:'row', backgroundColor:C.surface,
                       borderTopWidth:1, borderTopColor:C.border,
                       paddingVertical:4, paddingHorizontal:4},
  toolBtn:            {flex:1, alignItems:'center', paddingVertical:10, marginHorizontal:2},
  toolText:           {color:C.subtext, fontFamily:'monospace', fontSize:12},
  statusBar:          {flexDirection:'row', justifyContent:'space-between',
                       backgroundColor:C.statusBg, paddingHorizontal:14,
                       paddingVertical:5, borderTopWidth:1, borderTopColor:C.border},
  statusLeft:         {color:C.subtext, fontFamily:'monospace', fontSize:11},
  statusRight:        {color:C.subtext, fontFamily:'monospace', fontSize:11},
});
