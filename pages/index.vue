<template>
  <div class="content">
    <progress v-show="uploadPercentage>0" max="100" :value.prop="uploadPercentage"></progress>

    <!-- logo -->
    <Logo />

    <!-- progress -->
    <div id="steps">
      <div @click="goToStepOne()" class="step step-active">
        <span>You</span>
      </div>
      <div
        @click="goToStepTwo()"
        class="step"
        :class="{'step-active' : this.stepIdx == 2 || this.stepIdx == 3}"
      >
        <span>CV</span>
      </div>
      <div @click="goToStepThree()" class="step" :class="{'step-active' : this.stepIdx == 3}">
        <span>Done</span>
      </div>
    </div>

    <!-- form -->
    <form class="myform">
      <!-- error -->
      <Error
        v-show="errors != null || errorMessage != null"
        :title="errorMessage"
        :errors="errors"
      />

      <!-- success -->
      <Success v-show="successMessage != null" :title="successMessage" />

      <!-- result -->

      <!-- =========== STEP 1 ========== -->
      <div id="step_1" v-show="stepIdx == 1">
        <label class="myform__label" for="firstName">
          First Name
          <span class="myform__required">*</span>
          <input
            class="myform__input"
            v-model="form.first_name"
            id="firstName"
            name="first_name"
            type="text"
          />
        </label>

        <label class="myform__label" for="lastName">
          Last Name
          <input
            class="myform__input"
            v-model="form.last_name"
            id="lastName"
            name="last_name"
            type="text"
          />
        </label>

        <label class="myform__label" for="email">
          Email
          <span class="myform__required">*</span>
          <input class="myform__input" v-model="form.email" id="email" name="email" type="email" />
        </label>

        <label class="myform__label" for="git_profile">
          Git Profile
          <span class="myform__required">*</span>
          <div class="myform__col-2">
            <div class="m-auto">https://github.com/</div>
            <input
              class="myform__input"
              v-model="clone__git_profile"
              id="git_profile"
              name="git_profile"
              type="text"
            />
          </div>
        </label>

        <label class="myform__label" for="phone_number">
          Phone Number
          <input
            class="myform__input"
            v-model="form.phone_number"
            name="phone_number"
            id="phone_number"
            type="text"
          />
        </label>

        <label class="myform__label">
          Do you live in the UK?
          <span class="myform__required">*</span>
          <br />
          <input
            class="myform__radio"
            v-model="form.live_in_uk"
            type="radio"
            name="live_in_uk"
            value="true"
          /> Yes
          <br />
          <input
            class="myform__radio"
            v-model="form.live_in_uk"
            type="radio"
            name="live_in_uk"
            value="false"
          /> No
        </label>
      </div>
      <button
        v-show="stepIdx == 1 && stepOneCompleted()"
        class="myform__submit"
        @click.stop.prevent="next()"
      >Next</button>

      <!-- =========== STEP 2 ========== -->
      <div id="step_2" v-show="stepIdx == 2">
        <label class="myform__label" for="firstName">
          CV
          <span class="myform__required">*</span>
          <Upload
            class="myform__input"
            @selectedFile="onSelectCV"
            @isError="onShowError"
            :id="'cv'"
          />
        </label>

        <label class="myform__label" for="firstName">
          Covering Letter
          <Upload
            class="myform__input"
            @selectedFile="onSelectCoverLetter"
            @isError="onShowError"
            :id="'cover_letter'"
          />
        </label>

        <label class="myform__label" for="firstName">
          About You
          <span class="myform__required">*</span>
          <textarea class="myform__textarea" v-model="form.about_you">Tell me about yourselve..</textarea>
        </label>
      </div>
      <button v-show="stepIdx == 2" class="myform__submit" @click.stop.prevent="next()">Next</button>

      <!-- =========== STEP 3 ========== -->
      <div class="myform__summary" v-show="stepIdx == 3">
        <h1 class="myform__summary--title">Summary</h1>
        <hr />
        <ul class="myform__summary--ul">
          <li class="myform__summary--li" v-for="(field, idx) in Object.keys(form)" :key="idx">
            <!-- col left -->
            <div class="myform__summary--field">{{ field | no_underscore }}</div>

            <!-- col right -->
            <div v-if="field == 'cv'">{{ cvName }}</div>
            <div v-else-if="field == 'cover_letter'">{{ clName }}</div>
            <div v-else>{{ Object.entries(form)[idx][1] }}</div>
          </li>
        </ul>
      </div>
      <button
        v-show="stepIdx == 3"
        class="myform__submit"
        @click.stop.prevent="onSubmitForm()"
      >Submit</button>
    </form>
  </div>
</template>

<script>
import { URL, HEADERS } from "~/config";
import axios from "axios";

export default {
  data() {
    return {
      // steps
      stepIdx: 1,

      // error
      errorMessage: null,
      errors: null,

      // success
      successMessage: null,

      // local variables
      clone__git_profile: "",
      cvName: "",
      clName: "",

      // form submit criteria
      uploadPercentage: 0,
      form: {
        first_name: null,
        last_name: null,
        email: null,
        phone_number: null,
        live_in_uk: false,
        git_profile: null,
        cv: null,
        about_you: null
      }
    };
  },
  watch: {
    /**
     * @returns prepend the GitHub url to the user's profile
     * @param { Number } value
     */
    clone__git_profile(value) {
      this.form.git_profile = "https://github.com/" + value;
    }
  },
  methods: {
    /**
     * listen to selectedFile event from Upload child component
     * and set the local form.cv variable from the emitted value
     * @param { Object } CV an object emitted from the child component
     */
    onSelectCV(cv) {
      this.form.cv = cv;
      this.cvName = cv.name;
    },

    /**
     * listen to selectedFile event from Upload child component
     * and set the local form.cover_letter variable from the emitted value
     */
    onSelectCoverLetter(cl) {
      this.form.cover_letter = cl;
      this.clName = cl.name;
    },

    /**
     * Show error if unsupported documnet format was uploaded
     */
    onShowError(data) {
      this.errorMessage = data.errorMessage;
    },

    /**
     * submit form
     */
    onSubmitForm() {
      axios({
        method: "post",
        url: URL,
        data: this.getFormData(),
        headers: HEADERS,
        onUploadProgress: progressEvent => {
          this.uploadPercentage = parseInt(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          );
          if (this.uploadPercentage >= 99) {
            setTimeout(() => {
              this.uploadPercentage = 0;
            }, 3000);
          }
        }
      })
        .then(res => {
          this.successMessage = "Hello, Sam. Hope you are well!";
          this.clearErrors();
          window.scrollTo(0, 0);
        })
        .catch(err => {
          this.errorMessage =
            err.response.data.message || err.response.statusText;
          this.errors = err.response.data.errors;
          this.successMessage = null;
          this.uploadPercentage = 0;
          window.scrollTo(0, 0);
        });
    },

    /**
     * illiterate form object as array to append each element to formData
     * @return { FormData } formData
     */
    getFormData() {
      var formData = new FormData();
      Object.keys(this.form).forEach((name, i) => {
        formData.append(name, this.form[name]);
      });
      return formData;
    },

    /**
     * Clear Errors
     */
    clearErrors() {
      this.errors = null;
      this.errorMessage = null;
    },

    /**
     * Check if step 1 data fields are filled
     */
    stepOneCompleted() {
      return (
        this.form.first_name != null &&
        this.form.email != null &&
        this.form.live_in_uk != null &&
        this.form.git_profile != null
      );
    },

    /**
     * Check if step 2 data fields are filled
     */
    stepTwoCompleted() {
      return this.form.cv != null && this.form.about_you != null;
    },

    /**
     * Go to next step
     */
    next() {
      this.errorMessage = null;
      this.stepIdx++;
    },

    /**
     * Go to step one
     */
    goToStepOne() {
      if (this.errors == null) {
        this.errorMessage = null;
      }

      this.stepIdx = 1;
    },

    /**
     * Go to step two
     * restrict users from going to step two when step 1 is not completed.
     */
    goToStepTwo() {
      if (this.errors == null) {
        this.errorMessage = null;
      }

      if (!this.stepOneCompleted()) {
        this.errorMessage = "Please complete all required fields.";
        return;
      }
      this.stepIdx = 2;
    },

    /**
     * Go to step three
     * restruct users from going to step 3 when step one or two are not completed.
     */
    goToStepThree() {
      if (this.errors == null) {
        this.errorMessage = null;
      }

      if (!this.stepTwoCompleted() || !this.stepOneCompleted()) {
        this.errorMessage = "Please complete all required fields.";
        return;
      }
      this.stepIdx = 3;
    }
  },
  filters: {
    /**
     * Reaplce underscores to spaces
     * @param { Number } value
     * @returns value without the underscore
     */
    no_underscore(value) {
      return value.split("_").join(" ");
    }
  }
};
</script>

<style>
.content {
  display: grid;
  margin: 0 1vh;
  grid-template-columns: 1fr;
}
@screen sm {
  .content {
    margin: 0 10vh;
  }
}
@screen md {
  .content {
    margin: 0 15vh;
  }
}
@screen lg {
  .content {
    margin: 0 30vh;
  }
}
@screen xl {
  .content {
    margin: 0 45vh;
  }
}
/** steps */
#steps {
  @apply bg-gray-300 w-full;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
.step {
  @apply justify-center flex;
  @apply text-gray-500 cursor-pointer text-sm;
}
.step:hover {
  @apply bg-green-600 text-white;
}
.step-active {
  @apply bg-green-500  text-black;
}
.step > span {
  @apply m-auto m-1;
}
/** form */
.myform {
  @apply px-8 pt-6 pb-8 m-auto w-full;
  @apply border  rounded bg-white bg-white shadow-md rounded;
  display: grid;
  grid-gap: 11px;
}
.myform__col-2 {
  @apply font-normal;
  display: grid;
  grid-template-columns: 0fr 3fr;
}
.myform__required {
  @apply text-red-600;
}
.myform__label {
  @apply block text-gray-700 font-bold;
}
.myform__input,
.myform__textarea {
  @apply w-full py-2 px-3 m-1 appearance-none;
  @apply shadow  border rounded  text-gray-700 leading-tight;
}
.myform__input:focus,
.myform__textarea:focus {
  @apply outline-none shadow-outline;
}
.myform__textarea {
  @apply h-64;
}
.myform__radio {
  @apply m-1 mt-2;
}
.myform__submit {
  @apply bg-green-400 rounded py-2 text-white;
}
.myform__submit:hover {
  @apply bg-green-500;
}
.myform__summary--title {
  @apply font-bold;
}
.myform__summary--ul {
  @apply border p-1 rounded bg-gray-100;
}
.myform__summary--li {
  @apply text-gray-600 my-2 mx-1;
  display: grid;
  grid-template-columns: 1fr 2fr;
}
.myform__summary--field {
  @apply capitalize;
}
.myform__error {
  @apply text-red-700 text-xs;
}
/** progress */
progress {
  @apply fixed h-2 w-full top-0 left-0;
}
</style>
