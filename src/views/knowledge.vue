<template>
  <div>
    <PageHead title="知识文章">
      <template #buttons>
        <el-button @click="handleEdit({})" type="primary">新增</el-button>
      </template>
    </PageHead>
    <TableSearch :formItem="formItem" @search="handleSearch"></TableSearch>
    <el-table :data="tableData" style="width: 100%; margin-top: 25px">
      <el-table-column label="文章标题" width="500" fixed="left">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon><timer /></el-icon>
            <span>{{ scope.row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="分类" width="200">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon><timer /></el-icon>
            <span>{{ categoryMap[scope.row.categoryId] }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="authorName" label="作者" width="150" />
      <el-table-column prop="readCount" label="阅读量" width="150" />
      <el-table-column prop="updatedAt" label="更新时间" width="150" />
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="scope">
          <el-button text type="primary" @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
            @click="handlePublish(scope.row)"
            v-if="scope.row.status === 0 || scope.row.status === 2"
            text
            type="success"
            >发布</el-button
          >
          <el-button
            @click="handleUnpublish(scope.row)"
            v-if="scope.row.status === 1"
            text
            type="warning"
            >下线</el-button
          >
          <el-button @click="handleDelete(scope.row)" text type="danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- layout="prev,pager,next" 定义分页器的布局,显示功能组件 -->
    <el-pagination
      style="margin-top: 25px"
      :page-size="pagination.size"
      layout="prev,pager,next"
      :total="pagination.total"
      @change="handleChange"
    ></el-pagination>

    <!--等同于这三行代码:
    <ArticleDialog 
    :modelValue="dialogVisible" //传入数据,将父组件的 dialogVisible 变量的值，传递给子组件的 modelValue 属性
    @update:modelValue="dialogVisible = $event" /> //监听子组件触发的 update:modelValue 事件。当子组件触发这个事件时，父组件会自动把接收到的新值赋给 dialogVisible。 -->
    <ArticleDialog
      v-model:modelValue="dialogVisible"
      :categories="categories"
      :article="currentArticle"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import PageHead from "@/components/PageHead.vue";
import TableSearch from "@/components/TableSearch.vue";
import {
  categoryTree,
  articlePage,
  getArticleDetail,
  changeArticleStatus,
  deleteArticle,
} from "@/api/admin";
import ArticleDialog from "@/components/ArticleDialog.vue";
import { ElMessageBox, ElMessage } from "element-plus";

const formItem = [
  {
    comp: "input",
    prop: "title",
    label: "文章标题",
    placeholder: "请输入文章标题",
  },
  {
    comp: "select",
    prop: "category",
    label: "分类",
    placeholder: "请选择分类",
  },
  {
    comp: "select",
    prop: "status",
    label: "状态",
    placeholder: "请选择状态",
    options: [
      { label: "下线", value: "1" },
      { label: "草稿", value: "0" },
      { label: "发布", value: "2" },
    ],
  },
];

// 分页参数
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
});

//列表数据
const tableData = ref([]);

// 搜索文章
const handleSearch = async (formData) => {
  const params = {
    ...pagination,
    ...formData,
  };
  const { records, total } = await articlePage(params);
  tableData.value = records;
  pagination.total = total;
};

// 分页器改变时触发
const handleChange = (val) => {
  pagination.currentPage = val;
  handleSearch();
};

// 分类映射
const categoryMap = reactive({});
//分类列表
const categories = ref([]);

// 新增文章弹窗
const dialogVisible = ref(false);
//编辑
const currentArticle = ref(null);

const handleSuccess = () => {
  dialogVisible.value = false;
  //刷新列表
  handleSearch();
};
const handleEdit = (row) => {
  if (!row.id) {
    currentArticle.value = null;
    dialogVisible.value = true;
  } else {
    getArticleDetail(row.id).then((res) => {
      currentArticle.value = res;
      dialogVisible.value = true;
    });
  }
};

const handlePublish = (row) => {
  ElMessageBox.confirm("确认发布文章${row.title}吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "info",
  }).then(() => {
    changeArticleStatus(row.id, { status: 1 }).then(() => {
      ElMessage.success("发布成功");
      handleSearch();
    });
  });
};

const handleUnpublish = (row) => {
  ElMessageBox.confirm("确认下线文章${row.title}吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    changeArticleStatus(row.id, { status: 2 }).then(() => {
      ElMessage.success("下线成功");
      handleSearch();
    });
  });
};

const handleDelete = (row) => {
  ElMessageBox.confirm("确认删除文章${row.title}吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "danger",
  }).then(() => {
    deleteArticle(row.id).then(() => {
      ElMessage.success("删除成功");
      handleSearch();
    });
  });
};

//onMounted 组件挂载完成后调用
onMounted(async () => {
  const data = await categoryTree();
  // 处理分类数据
  categories.value = data.map((item) => {
    // 构建分类映射
    categoryMap[item.id] = item.categoryName; // 分类名称作为映射值，分类ID作为映射键
    return {
      label: item.categoryName,
      value: item.id,
    };
  });
  // 设置分类选项
  formItem[1].options = categories.value;

  handleSearch();
});
</script>
