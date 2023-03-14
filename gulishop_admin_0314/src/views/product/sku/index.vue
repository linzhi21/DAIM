<template>
  <div class="skuCar">
    <el-card>
      <el-table border stripe :data="skuList">
        <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
        <el-table-column label="名称" prop="skuName"></el-table-column>
        <el-table-column label="描述" prop="skuDesc"></el-table-column>
        <el-table-column label="默认图片">
          <template v-slot="{ row, $index }">
            <el-image :src="row.skuDefaultImg" style="width:100px;height:80px"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="重量" prop="weight"></el-table-column>
        <el-table-column label="价格" prop="price"></el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template v-slot="{ row, $index }">
            <el-button @click="onSale(row)" v-if="row.isSale === 0" type="success" size="small" icon="ele-Top"
              title="上架"></el-button>
            <el-button @click="cancelSale(row)" v-else type="info" size="small" icon="ele-Bottom" title="下架">
            </el-button>
            <el-button @click="updateSku(row)" type="warning" size="small" icon="ele-Edit" title="修改sku"></el-button>
            <el-button @click="showSkuInfo(row)" type="info" size="small" icon="ele-InfoFilled" title="查看sku详情">
            </el-button>
            <el-button @click="deleteSku(row)" type="danger" size="small" icon="ele-Delete" title="删除sku"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--  -->
      <el-pagination @current-change="getSkuList" v-model:currentPage="page" v-model:page-size="limit" :total="total"
        :pager-count="7" layout="prev, pager, next, jumper" />
    </el-card>

    <!-- 
    v-model="drawer"对应的就是抽屉的开关，需要自己定义
    size="50%" 相对视口拉出多少
   -->
    <el-drawer v-model="drawer" size="50%" :with-header="false" title="I am the title">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性值</el-col>
        <el-col :span="16">
          <el-tag type="danger" v-for="(attrValue, index) in skuInfo.skuAttrValueList" :key="attrValue.id">
            {{ attrValue.valueName }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">销售属性值</el-col>
        <el-col :span="16">
          <el-tag type="danger" v-for="(saleAttrValue, index) in skuInfo.skuSaleAttrValueList" :key="saleAttrValue.id">
            {{ saleAttrValue.saleAttrValueName }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="18">
          <!-- 轮播图 -->
          <!-- 轮播图组件有个属性是height控制轮播图的高度
          但是它没有宽度，想要设置宽度，得自己写样式 -->
          <el-carousel class="carousel" trigger="click" height="400px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <el-image :src="item.imgUrl" style="width:400px;height:400px"></el-image>
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>

  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Sku'
})
</script>
<script lang="ts" setup>
import skuApi, { type SkuListData, type SkuData } from '@/api/sku';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue'
const page = ref(1)
const limit = ref(10)
const total = ref(0)
//获取初始化动态数据
const skuList = ref<SkuListData>([])


// 上面我们的分页器里面page是双向数据同步，用户点击切换页码，我们父组件当中
// page也会跟着改变，因此发请求的时候，page里面就已经是最新页面，直接发请求就可以
// 不需要传递num = 1默认值参数

// 但是如果我们遇到删除成功，跳转不同的页码页面，还需要写num = 1的参数
// 因为后期我们可能自己调用这个函数进行传递页码，而不是通过双向数据同步修改页码
const getSkuList = async (num = 1) => {
  page.value = num
  try {
    const result = await skuApi.getPageList(page.value, limit.value)
    skuList.value = result.records
    total.value = result.total
  } catch (error) {
    ElMessage.error('获取sku的分页列表失败')
  }
}
// 挂载完成获取sku的分页列表
onMounted(() => {
  getSkuList()
})

// 上架操作
const onSale = async (row: SkuData) => {
  try {
    await skuApi.onSale(row.id as number)
    ElMessage.success('上架成功')
    getSkuList()
  } catch (error) {
    ElMessage.error('上架失败')
  }
}

// 下架操作
const cancelSale = async (row: SkuData) => {
  try {
    await skuApi.cancelSale(row.id as number)
    ElMessage.success('下架成功')
    getSkuList()
  } catch (error) {
    ElMessage.error('下架失败')
  }
}

// 修改sku
const updateSku = (row: SkuData) => {
  ElMessage.info('正在开发中......')
}

// 删除sku
const deleteSku = async (row: SkuData) => {
  try {
    await skuApi.deleteSku(row.id as number)
    ElMessage.success('删除sku成功')
    getSkuList(skuList.value.length > 1 ? page.value : page.value - 1)
  } catch (error) {
    ElMessage.error('删除sku失败')
  }
}

// 查看sku的详情信息
const drawer = ref(false)
const skuInfo = ref<SkuData>({
  price: 0,
  skuName: '',
  skuDesc: '',
  weight: '',
  tmId: '',
  category3Id: '',
  skuDefaultImg: '',
  skuImageList: [],
  skuAttrValueList: [],
  skuSaleAttrValueList: []
})
const showSkuInfo = async (row: SkuData) => {
  // 抽屉使用和对话框很像，都有一个开关数据
  drawer.value = true
  // 发请求获取sku详情数据，不能直接拿row去展示，因为row里面的sku信息不全
  try {
    const result = await skuApi.getById(row.id as number)
    skuInfo.value = result
  } catch (error) {
    ElMessage.error('获取sku详情失败')
  }
}

</script>

<!-- <style lang="scss">
  会让所有的轮播图指示器全部变为小圆点，页面上有很多轮播图，就全部改变
.skuCar{
  .el-carousel__indicator {
    button {
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: hotpink;
    }

    &.is-active {
      button {
        background-color: skyblue;
      }
    }
  }
}
</style> -->

<style lang="scss" scoped>
// 在scpoed限制的stuly当中，对某些组件设置样式是生效的
// 而对某些又是不生效的，此时我们需要研究scoped的作用
// 及解决办法
// 1、把不生效的样式不加scoped，重新写一个style
// 2、在加scoped的style中使用深度作用选择器（面试点）
.el-row {
  height: 40px;

  .el-col {
    height: 40px;
    line-height: 40px;

    &.el-col-5 {
      font-size: 20px;
      font-weight: 600;
      text-align: right;
      margin-right: 20px;
    }

    &.el-col-16 {
      // 必须保证盒子是块级盒子
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.carousel {
  width: 400px;
  // 把小横条变为小圆点

  //   /deep/
  :deep(.el-carousel__indicator) {
    button {
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: hotpink;
    }

    &.is-active {
      button {
        background-color: skyblue;
      }
    }
  }
}
</style>
