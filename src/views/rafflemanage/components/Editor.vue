<script setup>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

import { onBeforeUnmount, ref, shallowRef, onMounted } from "vue";
const props = defineProps({

  editPost: {
    type: String,
    default: {},
  },
})

const emit = defineEmits(['update:editPost'])


const mode = "default";
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
const rule = ref(props.editPost);

// 模拟 ajax 异步获取内容
onMounted(() => {
  console.log("editPost------------",props.editPost);
});

const toolbarConfig = { excludeKeys: "fullScreen" };
const editorConfig = { placeholder: "请输入内容..." };

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = editor => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
const test = ()=>{
  console.log(rule)
}
const handleChange = (editor) => {
      
      if(editor.getHtml() != '<p><br></p>'){ 
        emit('update:editPost', editor.getHtml())
      }
      return
    };
</script>

<template>
  <div style="border: 1px solid #ccc; width: 500px; ">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style=" height: 200px; overflow-y: hidden;"
      v-model="rule"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onChange="handleChange"
      @onCreated="handleCreated"
    />
  </div>
</template>