<template>
  <div>
    <el-card>
      <CategorySelector :disabled="!isShowList"></CategorySelector>
    </el-card>

    <el-card style="margin-top:20px">
      <!-- 这里只能vshow，vif如果条件切换，组件是要销毁重建的，销毁重建需要时间
    数据渲染可能会出现延迟 -->

      <!-- 这个是列表相关界面 -->
      <div v-show="isShowList">
        <el-button :disabled="!category3Id" type="primary" :icon="Plus" @click="showAddDiv">添加属性</el-button>
        <el-table :data="attrList" border>
          <el-table-column label="序号" type="index" align="center" width="80">
          </el-table-column>
          <el-table-column label="属性名称" width="150" prop="attrName">
          </el-table-column>
          <el-table-column label="属性值名称列表">
            <!-- row代表的是遍历的每个属性对象 -->
            <template v-slot="{ row, $index }">
              <el-tag type="danger" v-for="(attrValue, index) in row.attrValueList" :key="attrValue.id">
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template v-slot="{ row, $index }">
              <el-button @click="showUpdateDiv(row)" type="warning" size="small" :icon="Edit" title="修改属性"></el-button>
               <el-popconfirm :title="`你确定要删除${row.attrName}吗？`" @confirm="deleteAttr(row)">
                <template #reference>
                  <el-button type="danger" size="small" :icon="Delete" title="删除属性"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 这个是添加或者修改界面相关 -->
      <div v-show="!isShowList">
        <el-form :inline="true">
          <el-form-item label="属性名">
            <el-input v-model="attrForm.attrName" placeholder="输入属性名"></el-input>
          </el-form-item>
        </el-form>
        <el-button :disabled="!attrForm.attrName" type="primary" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowList = true">取消</el-button>
        <el-table :data="attrForm.attrValueList" border style="margin-top:20px">
          <el-table-column label="序号" type="index" align="center" width="80">
          </el-table-column>
          <el-table-column label="属性值名称">
            <template v-slot="{ row, $index }">
              <!-- 用户输入属性值名称，通过vmodel绑定到刚才你添加的属性值对象当中的
            属性值名称 -->

            <!-- 回车事件包含了一次失去焦点事件，那么回调函数就会执行两次 -->
              <el-input 
                ref="inputRef" 
                size="small" 
                @keyup.enter="toLook(row, $index)" 
                @blur="toLook(row, $index)" 
                v-if="row.isEdit"
                v-model="row.valueName">
              </el-input>
              <span 
                style="display:block;width:100%;height:100%" 
                v-else 
                @click="toEdit(row)">
                {{ row.valueName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{row,$index}">
              <el-popconfirm :title="`你确定要删除${row.valueName}吗？`" @confirm="attrForm.attrValueList.splice($index,1);">
                <template #reference>
                  <!-- <el-button>Delete</el-button> -->
                  <el-button title="删除属性值" type="danger" size="small" @click="" icon="ele-Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button :disabled="attrForm.attrValueList.length === 0" type="primary" @click="save">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>

  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'Attr'
})
</script>
<script lang="ts" setup>
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { useCategoryStore } from '@/stores/category'
import { ref, watch, nextTick } from 'vue'
import type { AttrData, AttrListData, AttrValueData } from '@/api/attr'
import attrApi from '@/api/attr'
import cloneDeep from 'lodash/cloneDeep'


// 列表页显示相关逻辑
const categoryStore = useCategoryStore()
const { category1Id, category2Id, category3Id } = storeToRefs(categoryStore)
const attrList = ref<AttrListData>([])
// 获取平台属性列表数据函数
const getAttrList = async () => {
  try {
    const result = await attrApi.getList(
      category1Id.value as number,
      category2Id.value as number,
      category3Id.value as number
    )
    attrList.value = result
  } catch (error) {
    ElMessage.error('获取平台属性列表失败')
  }
}
// 三级分类id发生改变就要做些事情
// 如果发生改变，改变后是一个空串，那么我们就不需要发请求，还要清空平台属性列表
// 如果发生改变，改变后不是空串，那么我们需要发请求获取最新的平台属性列表数据
watch(category3Id, (newVal, oldVale) => {
  // 监视3级分类id的变化，判断是不是空串决定是要发请求还是要清空属性列表数据
  if (!newVal) {
    // 证明3级分类被置为空串
    attrList.value = []
  } else {
    // 证明3级分类不是空串
    getAttrList()
  }
}, { immediate: true })
// 为啥要加immediate，是因为点击其它路由组件再切换回来，三级id还存在，但是没有
// 平台属性数据，所以要切换过来就要去发请求

// 添加的收集逻辑
const isShowList = ref(true)//切换列表和添加界面的标识数据

// 收集数据我们收集到哪，自己定义
// 收集数据的格式要去哪看，接口文档
const attrForm = ref<AttrData>({
  attrName: "",  //直接使用vmodel收集到位 
  // 下面这个属性值的列表收集步骤
  // 1、先让表格去展示这个属性值的数组,属性值数组一开始是空的，所以表格当中什么都没有
  // 如果数组当中有一项，表格才能出现一行，有两个对象，才能出现两行

  // 2、当用户点击添加属性值的时候，往数组当中去添加一项属性值对象
  // 只是添加属性值对象的时候，属性值名称不能写死，是空串，也不能有id，是新添加
  // 3、用户往数组当中去添加一个属性值对象，目的只是为了占位，让表格出现一行，出现
  // 这一行的时候，属性值名称这一项，让它是一个input输入框，用户后期就可以自己输入
  // 自己想要的属性值名称
  // 4、用户在input当中输入想要的属性值名称，通过vmodel，把输入的名称收集到当前这个
  // 添加的属性值对象当中
  attrValueList: [
    // {
    //   "attrId": 0,
    //   "id": 0,
    //   "valueName": "string"
    // }
  ],

  categoryId: 0,   //选中的3级id
  categoryLevel: 0, //选中的3级id的级别  1 2 3
})

const inputRef = ref<HTMLInputElement>()

// 点击添加属性
const showAddDiv = () => {
  isShowList.value = false
  // 解决添加完成取消再次添加，以前数据还存在的bug
  // 同时把categoryId及categoryLevel收集到位
  attrForm.value = {
    attrName: "",
    attrValueList: [],
    categoryId: category3Id.value as number,   //选中的3级id
    categoryLevel: 3, //选中的3级id的级别  1 2 3
  }
}

// 点击修改属性
const showUpdateDiv = (row: AttrData) => {
  isShowList.value = false
  // attrForm.value = {...row} 浅拷贝，里面的数组是对象当中的对象数据，它浅拷贝
  // 地址不变，所以列表页和修改使用的不同对象（拷贝了），内部数组还是同一个地址

  // 得使用深拷贝  面试点
  attrForm.value = cloneDeep(row)
  // 修改属性的时候才有已经存在的属性值数据，我们也要添加模式标识数据
  attrForm.value.attrValueList.forEach(item => item.isEdit = false)
  // vue3由于修改了响应式的原理，对于后期添加的属性也是响应式的
  // vue2当中后期添加的属性，不是响应式的，要想是响应式必须使用
  //  this.$set(item,'isEdit',false)


  // 要想弄懂深浅拷贝，得先弄懂拷贝
  // 什么是拷贝，只有出现新的地址才叫拷贝，说的是最外部对象数据出现新地址
  // 1、赋值不是拷贝
  // var a = 10
  // var b = a
  // var obj = {a:10}
  // var obj1 = obj

  // 浅拷贝其实就是拷贝
  // 如果一个对象，内部都是基本值，此时不谈深拷贝，直接拷贝就可以（拷贝其实就是浅拷贝）
  // var obj = {m:100,n:10}
  // var obj1 = {...obj}  //其实就是拷贝，因为外部对象出现了不同的数据地址，

  // 深拷贝
  // 如果一个对象内部有对象数据，拷贝完成之后，新对象内部的对象数据和原对象内部对象数据地址一样
  // 也是属于浅拷贝，就是拷贝
  // 如果一个对象内部有对象数据，拷贝完成之后，新对象内部的对象数据和原对象内部对象数据地址不一样
  // 才属于深拷贝
}

// 用户点击添加属性值按钮的时候
// 给属性值添加模式标识数据（1、给新添加的属性值添加 2、给已经存在的属性值添加）
// 无论是添加属性还是修改属性，在添加属性值的时候，
// 一上来属性值是属于可编辑的，叫编辑模式，显示input
// 修改属性的时候，属性当中是有已经存在的属性值，这些属性值我们需要显示span，代表是查看模式
// 对于每个属性值来说既然有两种显示方式，那么肯定要条件渲染，就要有标识数据
// 每个属性值都要有自己的标识数据
const addAttrValue = () => {
  attrForm.value.attrValueList.push({
    attrId: attrForm.value.id,  //代表的是当前属性值所属属性的id,也就是 attrForm的id，
    // 因为后期我们添加或修改的属性就是attrForm
    // 如果是添加的话，attrForm当中是没有id的，如果后期修改，我们是要让attrForm
    // 变为修改的某个属性，此时attrForm就有id了，也就是说无论是添加属性还是修改属性
    // 都有添加属性值的操作
    // 添加属性的时候这个值就是undefined
    // 修改属性的时候这个值就是属性的id
    // "id": 0,  新添加属性值，是没有属性值id的
    valueName: "", //一开始不能有值，新添加的属性值，属性值名称是为了让用户后期输入决定
    // 如果写上就写死了
    isEdit: true
  })
  // 自动获取焦点
  nextTick(() => {
    inputRef.value?.focus()
  })
}

// 切换编辑模式和查看模式
// 点击span，变为input 从查看模式变为编辑模式
const toEdit = (row: AttrValueData) => {
  row.isEdit = true
  // 自动获取焦点
  nextTick(() => {
    inputRef.value?.focus()
  })
}

//input失去焦点，或者回车  变为span，从编辑模式变为查看模式
const toLook = (row: AttrValueData, index: number) => {
  // 判断用户输入的数据合法性
  // input在切换为span之前要判断数据合法性
  // 1、数据是不是空的
  let attrValueName = row.valueName
  if (attrValueName === '' || attrValueName.trim() === '') {
    // 直接删除这一项，删除前最好把数据清空一下
    // attrValueName = '' 这个不行
    // ElMessage.error('输入的属性值名称不能为空白！！')
    row.valueName = ''
    // 直接删除这一个属性值对象
    // attrForm.value.attrValueList.splice(index, 1)
    attrForm.value.attrValueList = attrForm.value.attrValueList.filter(item => item !== row)
    return
  }
  // 2、除了自己以外，输入的数据是不是和其它的属性值名称重复
  let isRepeat = attrForm.value.attrValueList.some(item => {
    // 为什么要除去自身去判断
    // 因为一开始点击按钮，我们就已经把当前这个属性值对象添加到数据当中了，只是没有值
    // 我们后面才输入的属性值，输入属性值失去焦点的时候，这个新的属性值已经是数组的成员了
    // 此时你要去判定当前这个新的属性值名称和数组的其它人是否一样，所以不能带上自身
    // 带上自身，那么永远都有人和它重复，就是自己。
    if (item !== row) {
      return item.valueName === attrValueName
    }
  })
  if (isRepeat) {
    ElMessage.error('输入的属性值名称不能重复！！')
    row.valueName = ''
    // 直接删除这一个属性值对象
    attrForm.value.attrValueList.splice(index, 1)
    return
  }
  row.isEdit = false
} 

// 删除属性值,不需要发请求
// const deleteAttrValue = (index:number) => {
//   attrForm.value.attrValueList.splice(index,1)
// }

// 点击保存的逻辑
const save = async () => {
  // 1、获取请求参数
  let attr = attrForm.value
  // 2、整理参数
  // 把请求参数当中不需要的给干掉   isEdit肯定是多余的，是自己为了页面效果自己添加的，并不是
  // 后端要的，所以我们需要把isEdit去掉，要遍历所有的属性值，每个值里面都要删除isEdit
  // 1>、属性值名称如果为空串，从属性值列表当中去除
  // 2>、属性值当中去除isEdit属性
  attr.attrValueList = attr.attrValueList.filter(item => {
    if(item.valueName !== ''){
      // 把属性值名称不为空串的全部过滤出来，同时把每一项当中的isEdit给删掉
      delete item.isEdit
      return true
    }
  })
  // 3>、属性值列表如果没有属性值，不发请求
  if(!attr.attrValueList.length){
    ElMessage.error('属性值列表当中必须有值')
    return 
  }
  // 3、发请求
  try {
    // 4、成功干啥
    await attrApi.addOrUpdate(attr)
    ElMessage.success('保存属性成功')
    // 返回到列表页
    isShowList.value = true
    // 重新获取列表页数据
    getAttrList()
  } catch (error) {
    // 5、失败干啥
    ElMessage.error('保存属性失败')
  }
}

// 点击列表页删除属性，删除逻辑，需要发请求
const deleteAttr = async (row:AttrData) => {
  try {
    await attrApi.remove(row.id as number)
    ElMessage.success('删除属性成功')
    getAttrList()
  } catch (error) {
    ElMessage.error('删除属性失败')
  }
}

</script>

<style lang="less" scoped>
</style>
