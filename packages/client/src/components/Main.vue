<template>
  <main class="main_wrap" v-loading="loading" :element-loading-text="loadingMsg">
    <vue-typer :text="typeTexts" eraseStyle="backspace" :eraseDelay="100"></vue-typer>
    <el-avatar class="duck_img" shape="circle" :size="150" fit="fit" :src="duckImg"></el-avatar>
    <el-form :inline="true" :model="form" class="id_form">
      <el-row>
        <el-form-item label="Github ID">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="Github PW">
          <el-input show-password v-model="form.pw"></el-input>
        </el-form-item>
        <el-form-item label="Day">
          <el-select v-model="form.day">
            <el-option v-for="i in range" :key="i" :label="`${i}일차`" :value="i"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button class="submit_btn" type="primary" @click="onSubmit">오늘의 이슈 생성</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="submit_btn" type="danger" @click="onClose">이슈 닫기</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </main>
</template>

<script>
import { VueTyper } from "vue-typer";
import duckImg from "../assets/duck.png";
export default {
  data() {
    return {
      typeTexts: ["이슈 만들어주는 부덕이입니다.", "닫아주기도 합니다."],
      duckImg,
      form: {
        id: "",
        pw: "",
        day: 11
      },
      loading: false
    };
  },
  computed: {
    loadingMsg() {
      return `${this.form.day}일차 미션의 이슈를 생성하는 중입니다...`;
    },
    range() {
      return Array.from({ length: 6 }, (value, key) => key + 11);
    }
  },
  methods: {
    isEmpty(...args) {
      return !args.every(arg => arg);
    },
    onSubmit() {
      if (this.isEmpty(this.form.id, this.form.pw))
        return this.$message.warning("id와 비밀번호는 필수입니다.");

      this.loading = true;
      this.axios
        .post("/", {
          ...this.form,
          agent: window.navigator.userAgent
        })
        .then(({ data }) => {
          this.$message(data.message);
          this.loading = false;
        })
        .catch(({ message }) => {
          console.log(message);
          this.$message.error("이런! 문제가 발생했어요. 다시 시도해 주세요.");
          this.loading = false;
        });
    },
    onClose() {
      if (this.isEmpty(this.form.id, this.form.pw))
        return this.$message.warning("id와 비밀번호는 필수입니다.");

      this.loading = true;
      this.axios
        .put("/", {
          ...this.form,
          agent: window.navigator.userAgent
        })
        .then(({ data }) => {
          this.$message(data.message);
          this.loading = false;
        })
        .catch(({ message }) => {
          console.log(message);
          this.$message.error("이런! 문제가 발생했어요. 다시 시도해 주세요.");
          this.loading = false;
        });
    }
  },
  components: {
    VueTyper
  }
};
</script>

<style lang="scss">
.main_wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column wrap;
  text-align: center;
  min-height: 100vh;

  .vue-typer {
    font-size: 22px;
    font-weight: 300;
    margin-bottom: 40px;
    letter-spacing: -0.02em;
  }

  .duck_img {
    display: block;
    text-align: center;

    img {
      transition: all 0.2s ease;
    }

    &:hover {
      img {
        transform: scale(1.5);
      }
    }
  }

  .id_form {
    margin: 50px 0 0;
  }

  .submit_btn {
    margin-top: 30px;
  }

  .notice {
    letter-spacing: -0.02em;
    font-size: 0.9em;
    font-weight: 300;
    margin: 10px 0 0;
  }
}
</style>