<style lang="scss">

</style>

<template>
    <div class="news-container">
        <quill-editor :id="id" :content="content" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)"
                      @focus="onEditorFocus($event)"
                      @change="onEditorChange($event)">
        </quill-editor>
        <!-- 文件上传input 将它隐藏-->
        <el-upload class="upload-demo" action="/api/OperFile/uploadFile" :data="uploadData" :on-success='upScuccess'
                   ref="upload" style="display:none">
            <el-button size="small" type="primary" id="imgInput" element-loading-text="插入中,请稍候">点击上传</el-button>
        </el-upload>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';


    import {quillEditor} from 'vue-quill-editor'

    export default {

        props: {
            id: {
                type: String
            },
            // content:{
            //     type:String
            // }
        }, //父组件传递的参数

        components: { //注册组件

        },

        data() {  //初始化数据
            return {
                content: '',    // 文章内容
                editorOption: {
                    placeholder: "输入任何内容，支持html",
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            [{'header': 1}, {'header': 2}],
                            ['blockquote', 'code-block'],
                            [{'color': []}, {'background': []}, {'align': []}],
                            ['link', 'image'],
                            [{'indent': '-1'}, {'indent': '+1'}, {'list': 'ordered'}, {'list': 'bullet'}],
                            [{'script': 'sub'}, {'script': 'super'}, {'direction': 'rtl'}, 'clean'],
                            [{'font': []}],
                            [{'header': [3, 4, 5, false]}],
                            [{'size': ['small', false, 'large', 'huge']}],
                        ],
                    }
                },
                uploadData: {},
                photoUrl: '/api/OperFile/uploadFile',        // 上传图片地址
                uploadType: '',    // 上传的文件类型（图片、视频）
            }
        },

        watch: { //监控对象逻辑
        },

        computed: {  //动态计算返回的值

        },

        methods: { //逻辑方法
            // 编辑器光标离开 将编辑器内容发射给父组件
            onEditorBlur(event) {

            },

            // 编辑器获得光标
            onEditorFocus(event) {
            },

            //富文本框事件
            onEditorChange({quill, html, text}) {
                this.content = html;
                this.$emit('editorChange',html); //主动触发upup方法，'hehe'为向父组件传递的数据
            },
            // 图片上传成功回调   插入到编辑器中
            upScuccess(e) {
                let vm = this;
                console.log(e);
                let url = e.responseList;
                if (url !== null && url.length > 0) { // 将文件上传后的URL地址插入到编辑器文本中
                    let value = url;
                    vm.addRange = vm.$refs.myQuillEditor.quill.getSelection();
                    value = value.indexOf('http') !== -1 ? value : 'http:' + value;
                    vm.$refs.myQuillEditor.quill.insertEmbed(vm.addRange !== null ? vm.addRange.index : 0, vm.uploadType, value) // 调用编辑器的 insertEmbed 方法，插入URL
                }
                this.$refs['upload'].clearFiles() // 插入成功后清除input的内容
            },
            // 点击图片ICON触发事件
            imgHandler(state) {
                this.addRange = this.$refs.myQuillEditor.quill.getSelection()
                if (state) {
                    let fileInput = document.getElementById('imgInput');
                    fileInput.click() // 加一个触发事件
                }
                this.uploadType = 'image'
            },
            // 清除编辑器内容
            clearFiles() {
                this.content = ''
            },
        },

        created() {  //渲染组件前调用
        },
        mounted() {
            this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', this.imgHandler);
        }
    }
</script>