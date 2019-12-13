<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 层级一 -->
            <el-row
              v-for="(item1, index) in scope.row.children"
              :key="item1.id"
              class="bdbottom vcenter"
              :class="{'bdtop': index === 0}"
            >
              <el-col :span="5">
                <el-tag closable>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 层级二 -->
                <el-row
                  v-for="(item2, indey) in item1.children"
                  :key="item2.id"
                  class="vcenter"
                  :class="{'bdtop': indey!==0}"
                >
                  <el-col :span="6">
                    <el-tag type="success" closable>{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 层级三 -->
                    <el-tag
                      closable
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      @close="removeRightById(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="30%" @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRolesListApi, removeRightByIdApi, getRightsTreeApi, allotRightsApi } from '@/network/api'
import { message, MessageBox } from 'element-ui'
import { backHome } from '@/js/mixin'
export default {
  name: 'Roles',
  mixins: [backHome],
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        children: 'children', // 要进去遍历的属性
        label: 'authName' // 要显示的
      },
      // 默认选中的节点Id值数组
      defKeys: [],
      // 当前即将分配权限的角色id
      currentRoleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      const res = await getRolesListApi()

      if (res.meta.status !== 200) {
        return message.error('获取角色列表失败！')
      }

      this.rolelist = res.data

      console.log(this.rolelist)
    },
    // 删除权限
    async removeRightById(role, rightId) {
      console.log(role.id, rightId)
      const confirmResult = await MessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      if (confirmResult !== 'confirm') return message.info('取消了删除！')
      const res = await removeRightByIdApi(role.id, rightId)
      if (res.meta.status !== 200) return message.error('删除权限失败！')
      console.log(role.children, res)
      // res返回的是删除过后的其他权限 替换role的children不用重新获取数据
      role.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      console.log(role)
      // 设置当前展开的对象的id
      this.currentRoleId = role.id
      // 递归选出默认勾选的三级权限的id
      this.getDefKeys(role, this.defKeys)
      // 获取该用户的权限数据
      const res = await getRightsTreeApi()
      if (res.meta.status !== 200) return message.error('获取权限数据失败！')
      // 把获取到的权限数据保存到 data 中
      this.rightslist = res.data
      // console.log(this.rightslist)

      // 显示对话框
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getDefKeys(node, arr = []) {
      if (!node.children) {
        arr.push(node.id)
      } else {
        node.children.forEach(item => {
          this.getDefKeys(item, arr)
        })
      }
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      const idStr = keys.join(',')

      const res = await allotRightsApi(this.currentRoleId, idStr)

      if (res.meta.status !== 200) {
        return message.error('分配权限失败！')
      }

      message.success('分配权限成功！')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
