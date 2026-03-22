<template>
  <el-dialog
    :title="isEdit ? '更新文章' : '创建文章'"
    v-model="dialogVisible"
    width="50%"
    @close="handleClose"
  >
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="文章标题" prop="title">
        <!-- show-word-limit 显示输入字符数 clearable 可清除输入内容 -->
        <el-input
          v-model="formData.title"
          placeholder="请输入文章标题"
          maxlength="200"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item label="所属分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择分类">
          <el-option
            v-for="item in prop.categories"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文章摘要" prop="summary">
        <!-- :rows="4" 文本域高度为4行 -->
        <el-input
          type="textarea"
          v-model="formData.summary"
          placeholder="请输入文章摘要（可选）"
          maxlength="1000"
          show-word-limit
          clearable
          :rows="4"
        />
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-select
          v-model="formData.tagArray"
          placeholder="请输入标签（多个标签用逗号隔开）"
          multiple
          filterable
          allow-create
          style="width: 100%"
        >
          <el-option
            v-for="item in commonTags"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="封面图片">
        <!-- :action指定了文件上传的目标接口地址
        :before-upload在文件上传前触发， 用于对选择的文件进行校验或拦截
        :http-request="handleUploadRequest"实现自定义的上传逻辑
        accept="image/*"用于限制用户可以选择的文件类型。
        show-file-list="false" 不显示上传文件列表 -->
        <el-upload
          class="avatar-uploader"
          action="#"
          :before-upload="beforeUpload"
          :http-request="handleUploadRequest"
          accept="image/*"
          :show-file-list="false"
        >
          <div v-if="!imgurl" class="cover-placeholder">
            <p>点击上传封面图片</p>
          </div>
          <img v-else :src="imgurl" class="cover-image" alt="封面图片" />
        </el-upload>
        <div v-if="imgurl" class="cover-remove">
          <el-button
            style="display: block"
            type="danger"
            size="small"
            @click="handleRemove"
            >移除封面</el-button
          >
        </div>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <RichTextEditor
          v-model="formData.content"
          placeholder="请输入文章内容，支持富文本格式\n\n可以使用加粗、斜体、列表、标题等格式来丰富内容。"
          :maxCharCount="5000"
          @change="handleContentChange"
          @created="handleEditorCreated"
          min-height="400px"
        />
      </el-form-item>
    </el-form>
    <div v-if="btnPreview">
      <h3>内容预览</h3>
      <div v-html="formData.content"></div>
    </div>
    <template #footer>
      <el-button @click="btnPreview = !btnPreview">{{
        btnPreview ? "隐藏预览" : "预览效果"
      }}</el-button>
      <el-button @click="handleClose">取消</el-button>
      <!-- :loading防止多次点击提交按钮调用接口 -->
      <el-button type="primary" :loading="loading" @click="handleSubmit">{{
        isEdit ? "更新文章" : "创建文章"
      }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, computed, onMounted, nextTick, watch } from "vue";
import { ElMessage } from "element-plus";
import { getTags, uploadFile, createArticle, updateArticle } from "@/api/admin";
import { fileBaseUrl } from "@/config";
import RichTextEditor from "@/components/RichTextEditor.vue";

const prop = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  categories: {
    type: Array,
    default: () => [],
  },
  article: {
    type: Object,
    default: null,
  },
});

const isEdit = computed(() => !!prop.article?.id);

//监听编辑数据
watch(
  () => prop.article,
  (newVal) => {
    if (newVal) {
      console.log(newVal, "newVal");
      // 等待 nextTick 完成，确保 DOM 更新完成
      nextTick(() => {
        //浅拷贝
        Object.assign(formData, newVal);
        //使用现有id
        businessId.value = newVal.id;
        //更新封面图片
        imgurl.value = `${fileBaseUrl}${newVal.coverImage}`;
      });
    }
  }
);

const emit = defineEmits(["update:modelValue", "success"]);
const dialogVisible = computed({
  get: () => prop.modelValue, //获取父组件的 modelValue 属性值
  set: (val) => emit("update:modelValue", val), //设置父组件的 modelValue 属性值
});

const handleClose = () => {
  //重置表单
  formRef.value.resetFields();
  //重置id
  businessId.value = null;
  //重置标签
  formData.tagArray = [];
  handleRemove();
  emit("update:modelValue", false);
};

const formData = reactive({
  title: "",
  content: "",
  coverImage: "",
  categoryId: "",
  summary: "",
  tags: "",
  tagArray: [],
  id: "",
});
const rules = reactive({
  title: [
    { required: true, message: "请输入文章标题", trigger: "blur" },
    { max: 200, message: "文章标题最多200个字符", trigger: "blur" },
  ],
  categoryId: [{ required: true, message: "请选择分类", trigger: "change" }],
  content: [
    { required: true, message: "请输入文章内容", trigger: "blur" },
    {
      max: 5000,
      message: "文章内容最多5000个字符",
      trigger: "blur",
    },
  ],
});

const commonTags = [
  "情绪管理",
  "焦虑",
  "抑郁",
  "压力",
  "睡眠",
  "冥想",
  "正念",
  "放松",
  "心理健康",
  "自我成长",
  "人际关系",
  "工作压力",
  "学习方法",
  "生活技巧",
];
//接口调用获取标签
// onMounted(async () => {
//   const res = await getTags();
//   commonTags.value = res || []; //res || []是为了处理res为空的情况
// });

const beforeUpload = (file) => {
  console.log(file);
  //针对上传的文件进行校验
  const isImage = file.type.startsWith("image/"); //判断文件类型是否为图片
  const isLt5M = file.size / 1024 / 1024 < 5; //判断文件大小是否小于5MB

  if (!isImage) {
    ElMessage.error("上传封面图片，请选择图片文件");
    return false;
  }
  if (!isLt5M) {
    ElMessage.error("上传封面图片，封面图片大小不能超过5MB");
    return false;
  }
  return true;
};

//上传
const imgurl = ref("");
const businessId = ref("");
const handleUploadRequest = async ({ file }) => {
  //UUID生成
  businessId.value = crypto.randomUUID(); //生成一个随机的UUID作为业务ID,是一个字符串
  const fileRes = await uploadFile(file, { businessId });
  console.log(fileRes);

  //拼接完整的图片地址
  imgurl.value = `${fileBaseUrl}${fileRes.filePath}`;
  formData.coverImage = fileRes.filePath; //传给后端的地址
};

const handleRemove = () => {
  imgurl.value = "";
  formData.coverImage = "";
};

const handleContentChange = (data) => {
  formData.content = data.html; //将富文本编辑器的HTML内容赋值给formData.content
};

const editorInstance = ref(null);
// 编辑时，富文本编辑器创建完成后，设置HTML内容
const handleEditorCreated = (editor) => {
  editorInstance.value = editor; //将富文本编辑器实例赋值给editorInstance.value
  if (formData.content && editor) {
    //nextTick确保在DOM更新完成后执行
    nextTick(() => {
      editor.setHtml(formData.content); //将formData.content中的HTML内容设置到富文本编辑器中
    });
  }
};

const btnPreview = ref(false);

//提交
const formRef = ref(null);
const loading = ref(false);
const handleSubmit = async () => {
  formRef.value.validate((valid, fields) => {
    if (valid) {
      loading.value = true;
    }
    const submitData = {
      ...formData,
      tags: formData.tagArray.join(","),
    };
    delete submitData.tagArray; //删除tagArray属性,因为后端接收的是tags字符串

    if (!isEdit.value) {
      submitData.id = businessId.value;
      createArticle(submitData).then((res) => {
        loading.value = false;
        ElMessage.success("创建文章成功");
        emit("success");
      });
    } else {
      updateArticle(businessId.value, submitData).then((res) => {
        loading.value = false;
        ElMessage.success("更新文章成功");
        emit("success");
      });
    }
  });
};
</script>

<style lang="scss" scoped>
.cover-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 120px;
  background: #f6f8fa;
  flex-direction: column;
  color: #8b949e;
}
.cover-image {
  width: 200px;
  height: 120px;
  display: block;
}
</style>
