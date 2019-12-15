<template>
  <el-table :data="tableDate" border stripe>
    <!-- 展开行 -->
    <el-table-column type="expand">
      <template slot-scope="scope">
        <el-tag
          v-for="(item,index) in scope.row.attr_vals"
          :key="item"
          closable
          @close="handleClose(index, scope.row)"
        >{{item}}</el-tag>
        <el-input
          class="input-new-tag"
          v-if="scope.row.inputVisible"
          v-model="scope.row.inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm(scope.row)"
          @blur="handleInputConfirm(scope.row)"
        ></el-input>
        <el-button
          v-else
          class="button-new-tag"
          size="small"
          @click="showInput(scope.row)"
        >+ New Tag</el-button>
      </template>
    </el-table-column>
    <!-- 索引列 -->
    <el-table-column type="index" label="#"></el-table-column>
    <!-- 操作 -->
    <el-table-column prop="attr_name" label="参数名称"></el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-edit"
          @click="showEditDialog(scope.row.attr_id)"
        >编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          icon="el-icon-delete"
          @click="removeParams(scope.row.attr_id)"
        >删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { editParamsApi } from '@/network/api'
import { message } from 'element-ui'
import { isRepeat } from '@/js/utils'
export default {
  name: 'DataTable',
  props: {
    tableDate: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    // 显示修改对话框
    showEditDialog(attrId) {
      this.$emit('showEditDialog', attrId)
    },
    // 删除属性
    removeParams(attrId) {
      this.$emit('removeParams', attrId)
    },
    // 添加属性值 用户确认输入 文本框失去焦点，或摁下了 Enter 都会触发
    handleInputConfirm(row) {
      console.log(row)
      const inputVal = row.inputValue.trim()
      // 判断是否为空值
      if (inputVal === '') {
        row.inputValue = ''
        row.inputVisible = false
        return 0
      }
      // 判断是否已存在该标签
      if (isRepeat(inputVal, row.attr_vals)) return message.info('请不要填写重复项')
      // 如果没有return，则证明输入的内容，需要做后续处理
      // 向服务器发起请求 保存这次操作
      // const newVal = row.attr_vals.join(',') + ',' + row.inputValue.trim()
      const newVal =
        row.attr_vals.length === 0
          ? inputVal
          : row.attr_vals.join(',') + ',' + inputVal

      this.saveAttrVals(row, newVal).then(res => {
        // 要先确保服务器已经把数据改了 才能在页面改
        if (res === true) {
          row.attr_vals.push(row.inputValue.trim())
          row.inputValue = ''
          row.inputVisible = false
        }
      })
    },
    // 删除属性的值
    handleClose(index, row) {
      let newAttrVals = JSON.parse(JSON.stringify(row.attr_vals))
      newAttrVals.splice(index, 1)
      const newVal = newAttrVals.join(',')
      this.saveAttrVals(row, newVal).then(res => {
        if (res === true) {
          row.attr_vals.splice(index, 1)
        }
      })
    },
    // 将对 attr_vals 的操作，保存到数据库
    async saveAttrVals(row, newVal) {
      // 需要发起请求，保存这次操作
      /**
       * cateId 当前三级分类的id
       * attrId 当前属性的id
       * atrrName 当前属性的姓名
       * attrSel 属性的类型[many或only]
       * attrVals 修改后的属性的值 包含原来的值
       */
      const res = await editParamsApi(
        row.cat_id,
        row.attr_id,
        row.attr_name,
        row.attr_sel,
        newVal
      )
      if (res.meta.status !== 200) {
        message.error('修改参数项失败！')
        return false
      }
      message.success('修改参数项成功！')
      return true
    },
    // 显示输入框
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 100px;
}
</style>
