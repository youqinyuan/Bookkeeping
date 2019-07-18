<template>
    <div>
        <el-dialog title="图片剪裁" :visible.sync="dialogVisible" append-to-body>
            <div class="cropper-content">
                <div class="cropper" style="text-align:center">
                <vueCropper
                    ref="cropper"
                    :img="option.img"
                    :outputSize="option.size"
                    :outputType="option.outputType"
                    :info="true"
                    :full="option.full"
                    :canMove="option.canMove"
                    :canMoveBox="option.canMoveBox"
                    :original="option.original"
                    :autoCrop="option.autoCrop"
                    :fixed="option.fixed"
                    :fixedNumber="option.fixedNumber"
                    :centerBox="option.centerBox"
                    :infoTrue="option.infoTrue"
                    :fixedBox="option.fixedBox"
                ></vueCropper>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="yuantu" >原 图</el-button>
                <el-button type="primary" @click="caijian" >裁 剪</el-button>
            </div>
    </el-dialog>
    </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import {addClass} from '@/network/api'
export default {
    props: {

    },
    data() {
        return {
            dialogVisible:false,
            option: {
                img: '', // 裁剪图片的地址
                info: true, // 裁剪框的大小信息
                outputSize: 0.8, // 裁剪生成图片的质量
                outputType: 'jpeg', // 裁剪生成图片的格式
                canScale: false, // 图片是否允许滚轮缩放
                autoCrop: true, // 是否默认生成截图框
                // autoCropWidth: 300, // 默认生成截图框宽度
                // autoCropHeight: 200, // 默认生成截图框高度
                fixedBox: false, // 固定截图框大小 不允许改变
                fixed: true, // 是否开启截图框宽高固定比例
                fixedNumber: [5, 5], // 截图框的宽高比例
                full: true, // 是否输出原图比例的截图
                canMoveBox: true, // 截图框能否拖动
                original: false, // 上传图片按照原始比例渲染
                centerBox: true, // 截图框是否被限制在图片里面
                infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
            },
            file:""
        };
    },
    components: {
        VueCropper
    },
    computed: {

    },
    watch: {

    },
    created() {

    },
    mounted() {

    },
    methods: {
        open(imgbase,file){
            this.option.img = imgbase
            this.file = file
            this.dialogVisible = true
        },
        yuantu(){
            
            let img = window.URL.createObjectURL(this.file.raw) 
            // let formData = new FormData();
            // formData.append("icon", this.file.raw, this.file.name)
            this.$emit('getImgUrl',img, this.file)
            this.dialogVisible = false
            // console.log(formData.getAll('img')) 
            // let param = {
            //     name:"cs",
            //     parentId:17
            // }
            // for (let key in param) {
            //     if (typeof param[key] === 'object') {
            //     formData.append(key, JSON.stringify(param[key]))
            //     } else {
            //     formData.append(key, param[key])
            //     }
            // }
            // addClass(formData).then(res=>{
            //     console.log(res)
            // })
        },
        caijian(){
            this.$refs.cropper.getCropBlob((data) => {
                console.log(data)
                let img = window.URL.createObjectURL(data)
                let formData = new FormData();
                formData.append("icon", data, this.file.name)
                this.$emit('getImgUrl',img, formData)
                this.dialogVisible = false
                // console.log(formData.getAll('img')) 
            })
        }        
    },
};
</script>

<style scoped lang="less">
.cropper-content {
    .cropper {
        width: auto;
        height: 300px;
    }
}
</style>
