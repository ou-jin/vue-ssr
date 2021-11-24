<template>
    <div class>
        home
        <p v-for="it in item">{{it}}</p>
        <button @click="herf('p1')">p1</button>
        <button @click="herf('p2')">p2</button>
        <div>
            <router-view />
        </div>
    </div>
</template>

<script>
export default {
    asyncData({ store, route }) {
        return store.dispatch('readFileName', 'D://file')
    },
    computed: {
        item() {
            return this.$store.state.fileNames
        }
    },
    methods: {
        herf(path) {
            this.$router.push(path)
        }
    },
}
</script>
 