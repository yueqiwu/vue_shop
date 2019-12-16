<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon />
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="catePros"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 添加动态参数的面盘 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加参数</el-button>
          <!-- 动态数据表格 -->
          <table-data
            :tableDate="manyTableData"
            @showEditDialog="showEditDialog"
            @removeParams="removeParams"
          ></table-data>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加属性</el-button>
          <!-- 静态属性表格 -->
          <table-data
            :tableDate="onlyTableData"
            @showEditDialog="showEditDialog"
            @removeParams="removeParams"
          ></table-data>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <!-- 添加参数的表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClosed"
    >
      <!-- 修改参数的表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { backHome } from '@/js/mixin'
import {
  getCateListApi,
  getParamsListApi,
  addParamsApi,
  getAttributeByIdApi,
  removeParamsApi,
  editParamsApi
} from '@/network/api'
import { message, MessageBox } from 'element-ui'
import tableData from './cpns/DataTable'
export default {
  name: 'Params',
  mixins: [backHome],
  components: {
    tableData
  },
  data() {
    return {
      // 级联选择框 选中分类的id
      selectedKeys: [],
      // 分类列表
      cateList: [],
      // 级联选择框的配置对象
      catePros: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // tab标签当前选中项
      activeName: 'many',
      // 动态参数列表
      manyTableData: [],
      // 静态参数列表
      onlyTableData: [],
      // 控制添加属性的对话框
      addDialogVisible: false,
      // 控制修改属性的对话框
      editDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: ''
      },
      // 修改参数的表单数据对像
      editForm: {
        attr_name: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 修改表单的验证规则对象
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取分类列表
    async getCateList() {
      const res = await getCateListApi()
      if (res.meta.status !== 200) return message.error('参数列表获取失败！')
      this.cateList = res.data
    },
    // 级联选择框选中项改变 触发函数
    handleChange() {
      // console.log(this.selectedKeys)
      // 必选选择三级属性 否则清零
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        // 表格数据清零
        this.manyTableData = []
        this.onlyTableData = []
        return 0
      }
      // 获取参数列表
      this.getParamsList()
    },
    // tab标签被点击
    handleClick() {
      // console.log(this.activeName)
      this.getParamsList()
    },
    // 获取参数列表
    async getParamsList() {
      const res = await getParamsListApi(this.cateId, this.activeName)
      if (res.meta.status !== 200) {
        return message.error('获取参数列表失败！')
      }

      res.data.forEach(item => {
        // 把属性值改成数组 方便渲染标签
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        // 去除数组中的重复项
        const temp = new Set(item.attr_vals)
        item.attr_vals = Array.from(temp)
        // 属性值标签的input显示与隐藏以及绑定的值
        item.inputVisible = false
        item.inputValue = ''
      })

      console.log(res.data)

      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 添加属性对话框消失 清空表单数据
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 修改属性对话框消失 清空表单数据
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮，添加参数
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const res = await addParamsApi(
          this.cateId,
          this.addForm.attr_name,
          this.activeName
        )
        if (res.meta.status !== 201) {
          return message.error('添加参数失败！')
        }
        message.success('添加参数成功！')
        this.addDialogVisible = false
        this.getParamsList()
      })
    },
    // 点击按钮，展示修改的对话框
    async showEditDialog(attrId) {
      console.log(attrId)
      // 根据id获取参数
      const res = await getAttributeByIdApi(
        this.cateId,
        attrId,
        this.activeName
      )
      if (res.meta.status !== 200) return message.error('获取参数信息失败！')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 点击按钮，修改参数信息
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        /**
         * cateId 当前三级分类的id
         * attrId 当前属性的id
         * atrrName 修改后的姓名
         * attrSel 属性的类型[many或only]
         * attrVals 当前属性的值 增加或删除属性的值会用到 当前只需传原来的值
         */
        const res = await editParamsApi(
          this.cateId,
          this.editForm.attr_id,
          this.editForm.attr_name,
          this.activeName,
          this.editForm.attr_vals
        )

        if (res.meta.status !== 200) {
          return message.error('修改参数失败！')
        }

        message.success('修改参数成功！')
        this.getParamsList()
        this.editDialogVisible = false
      })
    },
    // 根据Id删除对应的参数项
    async removeParams(attrId) {
      const confirmResult = await MessageBox.confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 用户取消了删除的操作
      if (confirmResult !== 'confirm') {
        return message.info('已取消删除！')
      }

      // 删除的业务逻辑
      const res = await removeParamsApi(this.cateId, attrId)

      if (res.meta.status !== 200) {
        return message.error('删除参数失败！')
      }

      message.success('删除参数成功！')
      this.getParamsList()
    }
  },
  computed: {
    isBtnDisabled() {
      if (this.selectedKeys.length === 0) return true
      return false
    },
    cateId() {
      if (this.selectedKeys.length === 3) return this.selectedKeys[2]
      return null
    },
    titleText() {
      if (this.activeName === 'many') return '动态参数'
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
</style>
