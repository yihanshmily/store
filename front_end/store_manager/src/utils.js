import axios from "axios";
import { Toast } from "vant";
export default{
    warn(){
        Toast('暂未完成，敬请期待');
    },
                    // 上传图片
                    imgSuccess(file){
                        // 创建Form对象
                        const formdata = new FormData()
                        // 追加数据
                        formdata.append('file',file)
                        // 设置请求体
                        let config = {
                            headers:{'Content-Type':'multipart/form-data'}
                        };
                        axios.post('/file/upload',formdata,config)
            },
            // 展示图片
            getImage(image) {
                // return 'http://localhost:9527/image/' + image
                return 'http://localhost/image/'+image
            },
                    // 时间戳转
        timestampToTime (timestamp) {
            // 计算年月日时分的函数
                 var date = new Date(timestamp)
                 var Y = date.getFullYear() + '-'
                 var M = (date.getMonth() + 1) + '-'
                 var D = date.getDate() + ' '
                 var h = date.getHours() + ':'
                 var m = date.getMinutes() + ':'
                 var s = date.getSeconds()
                 return Y + M + D + h + m + s
             },
             
}