<script setup lang="ts">
import Uploader from 'vue-media-upload'
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

interface Props {
    modelValue?: string[]
    maxFiles?: number
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
    maxFiles: 1
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

// Watch the modelValue to ensure it never exceeds maxFiles
watch(() => props.modelValue, (newValue) => {
    if (props.maxFiles > 0 && newValue.length > props.maxFiles) {
        const limitedValue = newValue.slice(0, props.maxFiles)
        emit('update:modelValue', limitedValue)
    }
}, { immediate: true })

const onChange = (files: MediaItem[]) => {
    console.log('Uploaded files:', files)
    
    // STRICT enforcement of max files
    let limitedFiles = files
    if (props.maxFiles > 0) {
        // Always take only the first file if maxFiles is 1
        limitedFiles = files.slice(0, props.maxFiles)
        
        // If we already have files and trying to add more, replace instead of add
        if (props.maxFiles === 1 && files.length > 0) {
            limitedFiles = [files[0]] // Only take the first file
            console.log('Single file mode: Only keeping first file')
        }
    }
    
    console.log('After limiting:', limitedFiles)
    emit('update:modelValue', convertMediaToString(limitedFiles))
}

const onError = (error: unknown) => {
    console.error('Upload error:', error)
    if (typeof error === 'object' && error !== null) {
        const err = error as { status?: number; message?: string }
        console.error('Error status:', err.status)
        console.error('Error message:', err.message)
    } else {
        console.error('Error details:', String(error))
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
        :max-files="maxFiles"
    />
    
    <!-- Show warning if too many files -->
    <div v-if="props.modelValue.length > maxFiles" class="text-red-500 text-sm mt-2">
        ⚠️ Maximum {{ maxFiles }} file(s) allowed. Only the first {{ maxFiles }} will be kept.
    </div>
</template>