<template>
  <div id="wangeditor">
    <div ref="editorElem" style="text-align:left;" class="toolbar"></div>
    <div ref="editorElem1" style="text-align:left;" class="text"></div>
  </div>
</template>
<script>
import { getCookie } from "@/common/cookie.js";
import E from "wangeditor";
export default {
  name: "Editor",
  data() {
    return {
      editor: null,
      editorContent: ""
    };
  },
  // catchData是一个类似回调函数，来自父组件，当然也可以自己写一个函数，主要是用来获取富文本编辑器中的html内容用来传递给服务端
  props: ["catchData", "content"], // 接收父组件的方法
  mounted() {
    this.editor = new E(this.$refs.editorElem, this.$refs.editorElem1);
    this.editor.customConfig.uploadImgShowBase64 = true; // 使用 base64 保存图片
    this.editor.customConfig.uploadImgMaxSize = 100 * 1024 * 1024 //限制图片大小
    // this.editor.customConfig.uploadImgServer = "/opadmin/page/uploadFile";
    // this.editor.customConfig.uploadFileName = "file";
    // this.editor.customConfig.uploadImgHeaders = {
    //   token: getCookie().opadminToken
    // };
    // this.editor.customConfig.uploadImgHooks = {
    //   customInsert: function(insertImg, result, editor) {
    //     console.log(result);
    //     var url = result.content.url;
    //     insertImg(url);
    //   }
    // };
    this.editor.customConfig.zIndex = 100;
    // 编辑器的事件，每次改变会获取其html内容
    this.editor.customConfig.onchange = html => {
      this.editorContent = html;
      this.$emit("catchData", this.editorContent); // 把这个html通过catchData的方法传入父组件
    };
    this.editor.customConfig.colors = [
      "#000000",
      "#333333",
      "#666666",
      "#eeece0",
      "#1c487f",
      "#4d80bf",
      "#c24f4a",
      "#8baa4a",
      "#7b5ba1",
      "#46acc8",
      "#f9963b"
    ];
    this.editor.customConfig.menus = [
      // 菜单配置
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      "fontName", // 字体
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      "foreColor", // 文字颜色
      "backColor", // 背景颜色
      //"link", // 插入链接
      "list", // 列表
      "justify", // 对齐方式
      //"quote", // 引用
      //"emoticon", // 表情
      "image", // 插入图片
      //"table", // 表格
      //"code", // 插入代码
      "undo", // 撤销
      "redo" // 重复
    ];
    this.editor.create(); // 创建富文本实例
    // 初始化 textarea 的值
    this.editor.txt.html(this.content);
  }
};
</script>
<style lang="less" scoped>
.toolbar {
  border: 1px solid #ddd;
}
.text {
  border: 1px solid #ddd;
  height: 800px;
  border-top: none;
}
</style>