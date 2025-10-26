<script setup lang="ts">
import Uploader from 'vue-media-upload'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth' // Adjust path to your auth store

interface Props {
    modelValue?: string[]
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: () => []
})

interface MediaItem {
    name: string
}

const authStore = useAuthStore()

const convertStringToMedia = (str: string[]): MediaItem[] => {
    return str.map((element: string) => ({
        name: element,
    }))
}

const emit = defineEmits(['update:modelValue'])

const convertMediaToString = (media: MediaItem[]): string[] => {
    return media.map((element: MediaItem) => element.name)
}

const media = ref<MediaItem[]>(convertStringToMedia(props.modelValue))
const uploadUrl = ref<string>(import.meta.env.VITE_UPLOAD_URL)

// Get token directly from auth store
const uploadConfig = ref({
    headers: {
        'Authorization': `Bearer ${authStore.token}`
    },
    fieldName: 'image'
})

const onChange = (files: MediaItem[]) => {
    console.log('Uploaded files:', files)
    emit('update:modelValue', convertMediaToString(files))
}

const onError = (error: unknown) => {
    console.error('Upload error:', error)
    if (typeof error === 'object' && error !== null) {
        const err = error as { status?: number; message?: string }
        console.error('Error status:', err.status)
        console.error('Error message:', err.message)
    } else {
        console.error('Upload error is not an object:', error)
    }
}
</script>

<template>
    <Uploader 
        :server="uploadUrl" 
        @change="onChange" 
        @error="onError"
        :media="media"
        :upload-config="uploadConfig"
    />
</template>