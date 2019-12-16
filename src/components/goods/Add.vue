<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="+activeIndex" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格（元）" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量（kg）" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                :options="catelist"
                :props="cateProps"
                v-model="addForm.goods_cat"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="attr in item.attr_vals" :key="attr" :label="attr" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              :headers="headerObj"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce" />
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览图片的对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%"
      :before-close="handleDialogClose"
    >
      <img :src="previewPath" alt="预览图" class="precview-pic" />
    </el-dialog>
  </div>
</template>

<script>
import { getCateListApi, getParamsListApi, addGoodApi } from '@/network/api'
import { message } from 'element-ui'
import { deepClone } from '@/js/utils'
// 富文本编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'Add',
  components: {
    quillEditor
  },
  data() {
    return {
      activeIndex: 0,
      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: null,
        goods_weight: null,
        goods_number: null,
        // 商品所属的分类数组
        goods_cat: [],
        // 上传图片的数组
        pics: [],
        // 商品描述
        goods_introduce: ''
      },
      // 添加商品的验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      catelist: [],
      // 级联选择器的参数
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性数据列表
      onlyTableData: [],
      // 文件上传的头部
      headerObj: {
        Authorization: window.sessionStorage.getItem('vue_shop_token')
      },
      // 预览图的url
      previewPath: '',
      // 预览图像的对话框
      previewVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取全部分类
    async getCateList() {
      const res = await getCateListApi()
      if (res.meta.status !== 200) {
        return message.error('获取商品分类数据失败！')
      }
      this.catelist = res.data
      console.log(this.catelist)
    },
    // 级联选择器发生改变
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      } else {
        // 清除form表单的验证规则
        this.$refs.addFormRef.clearValidate('goods_cat')
      }
    },
    // tab切换 验证表单
    beforeTabLeave(activeName, oldActiveName) {
      let isValid
      let warning
      if (oldActiveName === '0') {
        // 验证表单
        this.$refs.addFormRef.validateField(
          [
            'goods_name',
            'goods_price',
            'goods_weight',
            'goods_number',
            'goods_cat'
          ],
          valid => {
            if (valid) {
              console.log(valid)
              isValid = false
              warning = valid
            }
          }
        )
      }
      if (isValid === false) {
        message.error(warning)
        return false
      }
    },
    // tab 点击
    async tabClicked() {
      // 证明访问的是动态参数面板
      if (this.activeIndex === '1') {
        const res = await getParamsListApi(this.cateId, 'many')

        if (res.meta.status !== 200) {
          return message.error('获取动态参数列表失败！')
        }
        console.log(res.data)
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })

        this.manyTableData = res.data
        console.log(this.manyTableData)
      } else if (this.activeIndex === '2') {
        const res = await getParamsListApi(this.cateId, 'only')
        if (res.meta.status !== 200) {
          return message.error('获取动态参数列表失败！')
        }
        console.log(res.data)
        this.onlyTableData = res.data
      }
    },
    // 图片上传成功 把上传成功的图片地址保存 以便添加商品请求时用
    handleSuccess(response) {
      // 1. 拼接得到一个图片信息对象
      const picInfo = {
        pic: response.data.tmp_path
      }
      // 2. 将图片信息对象，push 到pics数组中
      this.addForm.pics.push(picInfo)
      console.log(this.addForm.pics)
    },
    // 点击文件列表中已上传的文件时预览图片
    handlePreview(file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 移除图片 同时把保存的上传成功的图片地址删除
    handleRemove(file) {
      // 1. 获取将要删除的图片的临时路径
      const temPath = file.response.data.tmp_path
      // 2. 从 pics 数组中，找到这个图片对应的索引值
      const index = this.addForm.pics.findIndex(item => item.pic === temPath)
      // 3. 调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
      this.addForm.pics.splice(index, 1)
      console.log(this.addForm.pics)
    },
    // 预览对话框消失 图片url清空
    handleDialogClose() {
      this.previewPath = ''
      this.previewVisible = false
    },
    // 点击添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid === false) return message.error('请填写必要的表单项！')
        let form = deepClone(this.addForm)
        // 将goods_cat转换成字符串
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        form.attrs = []
        this.manyTableData.forEach(item => {
          const atrrInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          form.attrs.push(atrrInfo)
        })
        // 处理静态参数
        this.onlyTableData.forEach(item => {
          const atrrInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          form.attrs.push(atrrInfo)
        })
        console.log(form)

        const res = await addGoodApi(form)
        console.log(res)
        if (res.meta.status !== 201) {
          return message.error(res.meta.msg)
        }
        message.success('添加商品成功')
        // 跳转回good页
        this.$router.go('goods')
      })
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.precview-pic {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>
