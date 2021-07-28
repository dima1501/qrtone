<template lang="pug">
    .settings__section-item
        v-form(
            @submit.prevent="updateUserName"
            v-model="isCompanyDataValid")
            .settings__section-input
                v-text-field(
                    type="text"
                    label="Название компании"
                    v-model="newCompanyName"
                    :rules="nameRules"
                    required
                    :disabled="editCompany ? false : true")

            .settings__section-item
                .settings__section-input
                    v-textarea(
                        type="text"
                        label="Описание компании"
                        v-model="newCompanyDescription"
                        auto-grow
                        rows="2"
                        row-height="20"
                        :disabled="editCompany ? false : true")

            
            transition(name="slide-fade" mode="out-in")
                .settings__section-bottom(v-if="!editCompany" key="edit_comp_data")
                    .settings__section-link.-blue(@click="enableEditData" ) Редактировать
                .settings__section-bottom(v-if="editCompany" key="save_comp_data")
                    .settings__section-link.-red(@click="disableChangeUserName" v-if="editCompany") Отмена
                    button.settings__section-link.-blue(v-if="editCompany" :disabled="!isCompanyDataValid" type="submit") Сохранить
</template>

<script>
export default {
    props: {
        name: String,
        description: String
    },
    data() {
        return {
            isCompanyDataValid: true,
            editCompany: false,
            newCompanyName: '',
            newCompanyDescription: '',
            nameRules: [
                (v) => !!v || 'Введите название компании',
            ]
        }
    },
    mounted() {
        this.newCompanyName = this.name 
        this.newCompanyDescription = this.description 
    },
    methods: {
        updateUserName() {
            this.$store.dispatch('lk/updateUserData', {
                name: this.newCompanyName,
                description: this.newCompanyDescription
            })
            this.$store.state.auth.user.name = this.newCompanyName
            this.$store.state.auth.user.description = this.newCompanyDescription
            this.editCompany = false
        },
        enableEditData() {
            this.editCompany = true
            this.newCompanyName = this.name
            this.newCompanyDescription = this.description
        },
        disableChangeUserName() {
            this.editCompany = false
            this.newCompanyName = this.name
            this.newCompanyDescription = this.description
        }
    }
}
</script>