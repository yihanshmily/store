<template>
    <div>
        <!-- 标签栏 -->
        <div>
            <van-tabs @click="chooseItem">
                <van-tab v-for="(item, index) in identityList" :title="item.name" :key="index">
                    <!-- 搜索 -->
                    <van-search v-model="searchName" show-action placeholder="请输入你要搜索的名字" @search="onSearch"
                        @cancel="onCancel" />
                    <!-- 列表 -->
                    <div v-for="item in dataList" :key="item.id">
                        <span v-if="chooseIdentity === '管理员' && item.isSpecil === true " 
                            style="margin-left:270px;font-size: 17px;color: coral;">特殊管理员</span>
                        <van-contact-card type="edit" :name="item.name" :tel="item.tel" 
                            @click="lookInfo(item.id)"/>
                    </div>
                </van-tab>
            </van-tabs>
        </div>

        <!-- 内容编辑 -->
        <van-action-sheet v-model="modShow" :title="chooseIdentity + '信息'">
            <div style="margin-bottom: 200px;">
                <van-image round width="7rem" height="7rem" :src="utils.getImage(info.img)" />
                <div class="infoNews">
                    <div style="margin: 10px;">名：{{ info.name }}</div>
                    <div style="margin: 10px;">账号：{{ info.sole }}</div>
                    <div style="margin: 10px;">电话号码：{{ info.tel }}</div>
                </div>
                <div style="font-size: 18px;margin: 10px;" @click="changeStatus(info.id)">
                    <div v-if="chooseIdentity === '管理员'">
                        是否为特殊管理员 <van-switch v-model="info.isSpecil" />
                    </div>
                    <div v-else>
                        当前是否正常：<van-switch v-model="info.isStatus" />
                    </div>
                </div>
                <div style="font-size: 19px;margin: 10px;">创建时间：{{ utils.timestampToTime(info.createTime) }}</div>
                <div style="font-size: 19px;margin: 10px;">最近修改时间：{{ utils.timestampToTime(info.updateTime) }}</div>
            </div>
        </van-action-sheet>
        <div style="width: 100%;position: absolute;bottom: 10%;">

            <!-- 分页 -->
            <div style="margin-top: 20px;">
                <van-pagination v-model="page.currentPage" :total-items="page.numbers" :show-page-size="5"
                    :page-count="page.totalPages" items-per-page="7" force-ellipses style="margin-bottom: 20px;"
                    @change="changePage">
                    <template #prev-text> <van-icon name="arrow-left" /> </template>
                    <template #next-text> <van-icon name="arrow" /> </template>
                </van-pagination>
            </div>

            <!-- 新增 -->
            <div v-if="chooseIdentity === '管理员'">
                <van-button type="danger" size="large" round>新增管理员</van-button>
            </div>
        </div>
        <!-- 底部 -->
        <div>
            <van-tabbar v-model="active" route fixed>
                <van-tabbar-item to="/identity" icon="home-o">用户</van-tabbar-item>
                <van-tabbar-item to="/goods" icon="apps-o">商品</van-tabbar-item>
            </van-tabbar>
        </div>
    </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
import axios from 'axios'
export default {
    name: 'identity',
    data() {
        return {
            active: 0,
            searchName: 'all',
            chooseIdentity: '管理员',
            dataList: {},
            modShow: false,
            identityList: [
                { name: '管理员' }, { name: '用户' }, { name: '商铺' }
            ],
            info: {},
            page: {
                currentPage: '1',
                numbers: '10',
                totalPages: '7',
            }
        }
    },
    created() {
        this.getIdentityAll()
    },
    methods: {
        // 改变状态
        changeStatus(id){
            if(this.chooseIdentity === '管理员'){
                Dialog.confirm({
                message:'是否更改其管理员的特殊身份',
            }).then(()=>{
                this.changeApi(id)
                this.modShow = false
            })
            }else{
                Dialog.confirm({
                message:'是否更改其当前状态',
            }).then(()=>{
                this.changeApi(id)
                this.modShow = false
            })
            }
        },
        // 改变状态请求
        changeApi(id){
            axios.put('/identity/'+this.chooseIdentity+'/'+id).then(res=>{
                    if(res.data.flag){
                        Toast.success('修改成功')
                    }
                })
        },
        // 查看单独信息
        lookInfo(id) {
            axios.get('/identity/' + this.chooseIdentity + '/' + id).then(res => {
                if (res.data.flag) {
                    this.modShow = true
                    this.info = res.data.data
                }
            })
        },
        // 切换页数
        changePage() {
            this.getIdentityAll()
        },
        // 获取所有人物数据
        getIdentityAll() {
            const likeName = this.searchName === 'all' ? 'all' : this.searchName
            axios.get('/identity/' + this.chooseIdentity + '/like/' + likeName + '/' + this.page.currentPage + '/' + 5).then(res => {
                if (res.data.flag) {
                    this.dataList = res.data.data.dataList
                    this.page.totalPages = res.data.data.totalPages
                    this.page.numbers = res.data.data.numbers
                }
            })
            if (this.searchName === 'all') {
                this.onCancel()
            }
        },
        chooseItem(name, title) {
            this.chooseIdentity = title
            this.searchName = 'all'
            this.getIdentityAll()
        },
        onSearch() {
            this.getIdentityAll()
        },
        onCancel() {
            this.searchName = ''
        }
    }
}
</script>

<style>
.infoNews {
    margin: -100px 0px 0px 140px;
    font-size: 20px;
}

.infoTr {
    height: 50px;
    text-align: center;
}
</style>