<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="选择型号">
        <modelSelect
          :modelData="modelData"
          :passSelected="row==null?modelId:row.model"
          @modelDialogTellParentTheModel="getModel"
        />
      </el-form-item>
      <el-form-item label="选择仓库">
        <el-radio-group v-model="form.address">
          <el-radio :label="item.id" v-for="item in addressData" :key="item.id">{{item.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="初始库存" v-if="row==null">
        <el-input-number v-model="form.nums"></el-input-number>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import modelSelect from "@/views/manager/search/model.vue";

export default {
  components: { modelSelect },
  props: ["modelData", "addressData", "row","modelId","addressId"],
  data() {
    return {
      form: {
        model: null,
        address: null,
        nums: 0,
        tag: null
      }
    };
  },
  created() {
    if (this.row != null || this.row != undefined) {
      this.form = this.row;
    }
    if(this.modelId!=null || this.modelId!=undefined){
      this.form.model = this.modelId
      this.form.address = this.addressId
    }
  },
  watch: {
    form: {
      handler: function(val, oldVal) {
        this.$emit("recordOperationDialogTellParentFormValue", val);
      },
      deep: true
    }
  },
  methods: {
    getModel(data) {
      this.form.model = data;
    }
  }
};
</script>

<style>
</style>