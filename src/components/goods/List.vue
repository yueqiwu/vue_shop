<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索添加 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="getGoodsList"
            @keyup.native="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name">
          <template slot-scope="scope">
            <div v-html="scope.row.goods_name"></div>
          </template>
        </el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { backHome } from '@/js/mixin'
import { getGoodsListApi, removeGoodById } from '@/network/api'
import { message, MessageBox } from 'element-ui'
import { dateFormat } from '@/js/utils'
export default {
  name: 'List',
  mixins: [backHome],
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const res = await getGoodsListApi(this.queryInfo)
      if (res.meta.status !== 200) return message.error('获取商品列表失败')
      this.goodsList = res.data.goods
      this.total = res.data.total

      // 查询高亮
      if (this.queryInfo.query) {
        this.goodsList.forEach(item => {
          item.goods_name = item.goods_name
            .split(this.queryInfo.query)
            .join(`<span class="heightLight">${this.queryInfo.query}</span>`)
        })
      }
    },
    // 每页显示条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 当前页改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 删除商品
    async removeById(id) {
      const confirmResult = await MessageBox.confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') return message.info('已经取消删除！')
      const res = await removeGoodById(id)

      if (res.meta.status !== 200) return message.error('删除失败！')

      message.success('删除成功！')
      this.getGoodsList()
    },
    // 跳转add页
    goAddpage() {
      this.$router.push('goods/add')
    }
  },
  filters: {
    dateFormat
  }
}
</script>

<style lang="less" scope>
.heightLight {
  color: red;
  font-size: 14px;
}
</style>
