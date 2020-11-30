<template>
  <div class="m-content">
    <Card style="padding-left:20px">
      <div>
        <h3 class="mb20">换绑会员手机号码</h3>
        <Form ref="changePhones" :model="handPhonesDetail" :rules="ruleInline">
          <Row>
            <Col span="18">
            <FormItem label="旧手机号码:" prop="oldPhone">
              <Input
                v-model="handPhonesDetail.oldPhone"
                placeholder="请输入需换绑旧手机号码"
                style="padding-right: 5px;width: 300px"
              ></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="18">
            <FormItem label="新手机号码:" prop="newPhone">
              <Input
                v-model="handPhonesDetail.newPhone"
                placeholder="请输入需换绑新手机号码"
                style="padding-right: 5px;width: 300px"
              ></Input>
            </FormItem>
            </Col>
          </Row>
          <Button type="primary" class="ml300" @click="handleSubmit('changePhones')">确定</Button>
        </Form>
      </div>
    </Card>
  </div>
</template>

<script type="text/ecmascript-6">
import Tables from '_c/tables';
import { handPhones } from '@/api/mini-program';

const handPhonesDetail = {
  oldPhone: '',
  newPhone: ''
};
export default {
  components: {
    Tables
  },
  data() {
    return {
      ruleInline: {
        oldPhone: [{ required: true, message: '请输入换绑旧手机号码' }],
        newPhone: [{ required: true, message: '请输入换绑新手机号码' }]
      },
      handPhonesDetail: _.cloneDeep(handPhonesDetail)
    };
  },
  mounted() {},
  created() {},
  methods: {
    resetFields() {
      this.$refs.changePhones.resetFields();
    },
    handleSubmit() {
      console.log('手机详情', this.handPhonesDetail);
      if (
        !/^1[3578][0-9]{9}(,1[3578][0-9]{9})*$/.test(
          this.handPhonesDetail.oldPhone
        )
      ) {
        this.$Message.error('请输入正确的旧手机号码');
        return;
      }
      if (
        !/^1[3578][0-9]{9}(,1[3578][0-9]{9})*$/.test(
          this.handPhonesDetail.newPhone
        )
      ) {
        this.$Message.error('请输入正确的新手机号码');
        return;
      }

      handPhones(this.handPhonesDetail)
        .then(res => {
          this.$Message.success(res);
          this.$refs.changePhones.resetFields();
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
