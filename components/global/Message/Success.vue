<template>
<div class="bg-green-100 border-t-4 border-green-500 rounded-b text-green-900 px-4 py-3 shadow-md" role="alert">
    <div class="flex">
        <div class="py-1"><svg class="fill-current h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg></div>
        <div>
        <p class="font-bold">{{ title }}</p>
        <div class="text-sm">Thank you for your time for reviewing my technical test. :)</div>
        </div>
    </div>
</div>
</template>

<script>

export default {
    props:{
        title:{
            type: String,
        },
        subtitle:{
            type: String,
        },
    }
}
</script>

