<template>
  <div>
    <el-card>
      <template #header>
        <span>
          <el-button type="primary" :icon="Plus" @click="showAddDialog">添加</el-button>
        </span>
      </template>

      <!-- 之前我们html当中表格是按行走的，但是element-plus当中的表格是按列走的 -->
      <!-- table身上有一些属性，border代表边框，值是布尔值， stripe代表斑马状
      
      表格的data就是专门用来展示动态数据的，而且数据格式必须是数组，对象的数组*******
      把data传递给表格table，那么这个data会给每个列也默认传递了一份，
      每个列的内部，都是在展示你传递的data数组数据
      如果每个列内部展示的过程当中需要额外的结构和样式，那么由父组件说了算
      -->
      <el-table :data="trademarkList" border :style="{marginBottom:'20px'}">
        <!-- 每个列组件身上都有label属性，代表列的标题
        width代表每个列的宽度，宽度是px值，但是不用带px，如果不写，默认平分天下，
        align代表每个列的内容对齐方式  align=center，代表居中
        type代表这一列的类型，如果是序号列，我们只需要写type为index，默认就会从1开始
        prop代表每个列要显示的数据
        -->
        <el-table-column label="序号" width="80" type="index" align="center"></el-table-column>
        <el-table-column label="品牌名称" prop="tmName"></el-table-column>
        <el-table-column label="品牌LOGO">
          <!-- 列组件内部是有作用域插槽 -->
          <!-- row代表的是回传的data当中每一项，row代表的就是每一个品牌对象，$index代表下标 -->
          <template v-slot="{ row, $index }">
            <el-image :src="row.logoUrl" style="width:100px;height:60px"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row, $index }">
            <!-- 这里也要去填作用域插槽坑，因为后期点击按钮，我们需要知道点的是哪个品牌的操作
          所以，需要知道row才可以继续操作，否则点击按钮我们不知道操作的是哪个品牌 -->
            <el-button type="warning" size="small" :icon="Edit" @click="showUpdateDialog(row)">修改</el-button>
            <el-button type="danger" size="small" :icon="Delete" @click="deleteTrademark(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器不要去输入联想，联想的是错的，去官网上拷贝 -->
      <!-- 
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
       -->
      <el-pagination @size-change="handleSizeChange" @current-change="getTrademarkList" v-model:currentPage="page"
        v-model:page-size="limit" :total="total" :pager-count="7" :page-sizes="[3, 5, 7, 10]"
        layout="prev, pager, next, jumper,->,sizes, total" />
    </el-card>

    <!-- dialogFormVisible是一个动态数据，布尔值，true代表显示对话框，false代表隐藏 -->
    <el-dialog v-model="dialogFormVisible" :title="tmForm.id ? '修改品牌' : '添加品牌'">
      <!-- 一个table一个是form，table后期我们主要用来展示列表数据，form后期主要用来收集数据
    所以这两个组件必须搞定 -->

      <!-- form身上首先以后都要写一个model属性，这个属性有两个作用
        1、指定收集数据收集的对象
        2、表单验证的时候和表单验证的规则对象数据进行关联
       -->

      <!-- 表单验证的步骤：
        1、需要在form身上添加model属性
        2、定义rules对象，规则对象就会自动和收集数据的对象关联
        3、在每个item身上协商需要校验的规则对象对应的属性字段
       -->
      <el-form ref="tmFormRef" :rules="rules" :model="tmForm" label-width="100px" style="width:80%">
        <!-- form身上写 label-width="100px"代表每一项都写了-->
        <!-- 单个校验 -->
        <el-form-item label="品牌名称" prop="tmName">
          <!-- 品牌名称直接vmodel收集到位 -->
          <el-input v-model="tmForm.tmName" />
        </el-form-item>

        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload class="avatar-uploader" 
            :action="`${baseUrl}/admin/product/upload`" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <!-- 预览图 -->
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
            <template #tip>
              <div class="el-upload__tip">
                上传的图片必须是jpg且不能大于2M
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="addOrUpdateTrademark">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Trademark'
})
</script>
<script lang="ts" setup>
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { onMounted, reactive, ref,nextTick } from 'vue'
import trademarkApi from '@/api/trademark'
import type { TrademarkData } from '@/api/trademark'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import type { UploadProps } from 'element-plus'

// 列表页逻辑（查）
const page = ref(1)
const limit = ref(3)
const trademarkList = ref<TrademarkData[]>([])
const total = ref(0)
// 挂载完成去发请求获取品牌列表数据
onMounted(() => {
  getTrademarkList()
})
// 获取trademark品牌列表数据
const getTrademarkList = async (num = 1) => {
  page.value = num
  try {
    const result = await trademarkApi.getPageListInfo(page.value, limit.value)
    trademarkList.value = result.records
    total.value = result.total
  } catch (error) {
    ElMessage.error('获取品牌列表失败')
  }
}


// 修改每页显示数量的回调,不能和修改当前页一样，复用请求函数，因为位置已经固定死了
const handleSizeChange = (size: number) => {
  limit.value = size
  getTrademarkList()
}


// 添加的收集逻辑
const dialogFormVisible = ref(false)
const baseUrl = import.meta.env.VITE_API_URL
// const imageUrl = ref('')
// 要添加品牌本质就是前端通过收集数据，构造一个后端接口需要的参数结构（品牌对象）
// 然后点击确定的时候，发请求，把收集的对象传递参数，给后端，后端把对象数据，添加到数据库的操作
// 我们前端就要去想办法把数据收集成一个品牌对象
// 收集的对象得自己定义，收集什么要看接口文档要什么参数
const tmForm = ref<TrademarkData>({
  tmName: '',
  logoUrl: ''
})

const tmFormRef = ref<FormInstance>()

// 表单验证规则代理对象
// 规则对象当中是每个属性字段，和收集的对象属性名称一样
// 每个字段的值都是一个规则对象数组，数组当中放的是每个字段的规则对象，一个字段可以有多条规则
// 每个字段的规则对象包含三个属性
// 1、代表规则
// 2、错误消息
// 3、触发方式  失去焦点触发   修改内容触发   整体校验的时候触发


// 自定义验证规则的验证器函数
// rule代表规则本身，用来占位用的
// value代表用户输入的数据
// callback代表验证通过还是不通过(callback如果传递参数（错误对象），代表验证失败，如果没有参数代表验证成功)
const checkTmName = (rule: any, value: any, callback: any) => {
  if(value.length < 2 || value.length > 20){
    callback(new Error('品牌名称长度必须在2-20之间'))
  }else{
    callback()
  }
}


const rules = reactive<FormRules>({
  tmName: [
    // 内置规则
    { required: true, message: '品牌名称必须填写', trigger: 'blur' },
    // { min: 2, max: 10, message: '品牌名称长度2-10', trigger: 'change' },
    
    // 自定义规则
    // 其实就是写验证器，每个验证器是一个函数
    { validator: checkTmName, trigger: 'change' }

  ],
  logoUrl: [
    {
      required: true,
      message: '品牌LOGO必须上传',
        //因为上传组件不是表单元素，所以触发方式不能生效，只有
      // 整体校验的时候才会触发，因此这里触发方式写什么无所谓
    }
  ]
})



// 点击添加显示添加的dialog
const showAddDialog = () => {
  dialogFormVisible.value = true
  // 解决收集完成点击取消，再点添加数据依然存在的bug
  // 下面两种方案都可以，但是本质不一样，第一种直接把代理对象地址换了
  // 第二种，是把代理对象内部的属性给覆盖了，代理对象地址没变
  tmForm.value = {
    tmName: '',
    logoUrl: ''
  }
  // Object.assign(tmForm.value,{
  //   tmName: '',
  //   logoUrl: ''
  // })
  // 清理原来表单的验证规则留下的错误提示信息
  // 解决添加成功一个品牌，再点击添加会出现自定义验证规则错误信息
  // nextTick(() => {
  //   nextTick(() => {
  //     tmFormRef.value?.clearValidate()
  //   })
  // })
  tmFormRef.value?.resetFields()
}
// 处理头像上传成功的回调
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  // 上传成功的回调当中第一个参数的data就是我们要收集的图片路径
  // console.log(response,uploadFile);
  tmForm.value.logoUrl = response.data //收集到了我们要的图片路径
  // imageUrl.value = URL.createObjectURL(uploadFile.raw!)//这行没意义
  // console.log(URL.createObjectURL(uploadFile.raw!))//获取的本地图片的路径
}
// 头像上传前的回调
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // rawFile代表的就是上传的图片文件
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('图片必须是jpg格式！')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小不能超过2MB!')
    return false
  }
  return true
}


// 修改收集数据的逻辑
// 添加和修改用的是同一个dialog，所以我们在弹出的时候还是添加的dialog界面
// 只是添加的时候没有数据回显（tmForm我们定义的对象，都是空串），
// 修改的时候有数据回显，点击修改，我们把当前点击的列表的当中对应的trademark数据赋值给tmForm
// 此时tmForm就不再是原来你定义的空串对象，就换成有id的trademark对象，它里面是有数据的
// 本质就是因为我们定义的对象和修改传递的row里面的数据，属性名都是一样的，多了一个id
// 添加和修改收集的对象不是同一个
// 添加的时候收集的数据是放在我们定义的tmForm对象当中
// 修改的时候，虽然收集的数据也是在tmForm当中，但是此时已经不是自己定义的那个对象了，换成row了
// 添加时候收集的数据是没有id的
// 修改时候tmForm被换成了row，row里面本身是有id的，收集的数据是收集在有id的对象当中
const showUpdateDialog = (row: TrademarkData) => {
  dialogFormVisible.value = true
  tmForm.value = { ...row } //回显数据
  // 地址不能相同，拷贝
}

// 添加和修改的请求逻辑
const addOrUpdateTrademark = async () => {
  try {
    // 对form表单的整体校验
    await tmFormRef.value?.validate()
    // 校验成功
    // 1、获取请求参数，在这就是我们的tmForm
    let trademark = tmForm.value
    // 2、整理参数，需要的时候再整理，不需要就不整理了,这里不需要整理
    // 因为tmForm当中数据本来就是文档要求的参数，不多也不少，结构也符合

    // 3、发请求
    try {
      await trademarkApi.addOrUpdate(trademark)
      // 4、成功干啥 
      // 4-1提示
      ElMessage.success(trademark.id ? '修改品牌成功' : '添加品牌成功')
      // 4-2关闭对话框
      dialogFormVisible.value = false
      // 4-3重新获取列表页数据
      // 添加成功（获取第一页数据）和修改成功（原地不动），最终获取的列表数据页码是不一样的
      getTrademarkList(trademark.id ? page.value : 1)
    } catch (error) {
      // 5、失败干啥
      ElMessage.error(trademark.id ? '修改品牌失败' : '添加品牌失败')
    }
  } catch (error) {
    // // 校验有问题
    // ElMessage.error('校验失败')
  }




}

// 删除品牌的逻辑
const deleteTrademark = (row: TrademarkData) => {
  ElMessageBox.confirm(
    `你确定要删除${row.tmName}吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      // 点击确定的逻辑
      // 发请求删除对应的品牌
      try {
        await trademarkApi.remove(row.id as number)
        ElMessage.success('删除品牌成功')
        // 重新获取列表数据
        // 如果当前页只有1条，删除了以后要去到前一页，如果当前页比1条多，那么就停留当前页
        getTrademarkList(trademarkList.value.length > 1 ? page.value : page.value - 1)
      } catch (error) {
        ElMessage.error('删除品牌失败')
      }
    })
    .catch(() => {
      // 点击取消的逻辑
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      })
    })
}







</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
