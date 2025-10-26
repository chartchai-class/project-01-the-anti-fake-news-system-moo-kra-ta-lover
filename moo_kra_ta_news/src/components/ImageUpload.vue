<script setup lang="ts">
import Uploader from 'vue-media-upload'
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

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

// Convert string to MediaItem - always take only first item
const convertStringToMedia = (str: string[]): MediaItem[] => {
    if (str.length === 0) return []
    return [{
        name: str[0] // Only use the first item
    }]
}

const emit = defineEmits(['update:modelValue'])

const convertMediaToString = (media: MediaItem[]): string[] => {
    return media.map((element: MediaItem) => element.name)
}

const media = ref<MediaItem[]>(convertStringToMedia(props.modelValue))
const uploadUrl = ref<string>(import.meta.env.VITE_UPLOAD_URL)

const uploadConfig = ref({
    headers: {
        'Authorization': `Bearer ${authStore.token}`
    },
    fieldName: 'image'
})

// Track if we already have an image
const hasImage = ref(false)

const onChange = (files: MediaItem[]) => {
    console.log('Uploaded files:', files)
    
    // STRICT single file enforcement
    let finalFiles: MediaItem[] = []
    
    if (files.length > 0) {
        // Always take only the FIRST file, ignore all others
        finalFiles = [files[0]]
        hasImage.value = true
    } else {
        hasImage.value = false
    }
    
    console.log('Final files after restriction:', finalFiles)
    emit('update:modelValue', convertMediaToString(finalFiles))
}

const onError = (error: unknown) => {
    console.error('Upload error:', error)
    if (typeof error === 'object' && error !== null) {
        const err = error as { status?: number; message?: string }
        console.error('Error status:', err.status)
        console.error('Error message:', err.message)
        
        // Show user-friendly error message
        alert(`Upload failed: ${err.message || 'Unknown error'}`)
    } else {
        console.error('Upload error is not an object:', error)
        alert('Upload failed. Please try again.')
    }
}

// Reset when modelValue becomes empty
watch(() => props.modelValue, (newValue) => {
    console.log('modelValue changed:', newValue)
    if (newValue.length === 0) {
        media.value = []
        hasImage.value = false
    } else {
        media.value = convertStringToMedia(newValue)
        hasImage.value = true
    }
}, { immediate: true })

// Method to clear current image
const clearImage = () => {
    media.value = []
    hasImage.value = false
    emit('update:modelValue', [])
}
</script>

<template>
    <div class="image-upload-container">
        <!-- Upload Area - Show when no image is selected -->
        <div v-if="!hasImage" class="upload-area">
            <div class="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50">
                <div class="max-w-md mx-auto">
                    <div class="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
                        <span class="text-2xl text-blue-600">📷</span>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">
                        Upload News Image
                    </h3>
                    <p class="text-gray-600 mb-6 text-sm leading-relaxed">
                        Drag and drop your image here, or click to browse<br>
                        
                    </p>
                    
                    <!-- Uploader Component -->
                    <div class="uploader-wrapper">
                        <Uploader 
                            :server="uploadUrl" 
                            @change="onChange" 
                            @error="onError"
                            :media="media"
                            :upload-config="uploadConfig"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- Image Preview - Show when image is selected -->
        <div v-else class="image-preview">
            <div class="bg-green-50 border border-green-200 rounded-2xl p-6">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                            <span class="text-green-600 text-lg">✅</span>
                        </div>
                        <div>
                            <h4 class="font-semibold text-green-900">Image Ready</h4>
                            <p class="text-green-700 text-sm">Your news image has been uploaded successfully</p>
                        </div>
                    </div>
                    <!-- <button 
                        type="button" 
                        @click="clearImage" 
                        class="flex items-center gap-2 px-4 py-2 bg-white border border-red-300 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-400 transition-colors font-medium text-sm"
                    >
                        <span>🗑️</span>
                        Change Image
                    </button> -->
                </div>
                
                <!-- Image Thumbnail -->
                <div class="flex items-center gap-4 bg-white rounded-xl p-4 border border-green-100">
                    <img 
                        v-if="media[0].name" 
                        :src="media[0].name" 
                        alt="News preview" 
                        class="w-20 h-20 object-cover rounded-xl border shadow-sm"
                    />
                    <div class="flex-1">
                        <p class="text-gray-900 font-medium text-sm mb-1">News Featured Image</p>
                        <p class="text-gray-500 text-xs">This image will appear with your news article</p>
                    </div>
                    <button 
                        type="button" 
                        @click="clearImage" 
                        class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove image"
                    >
                        <span class="text-lg">✕</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Helper Text -->
        <div class="mt-3 text-center">
            <p class="text-xs text-gray-500 flex items-center justify-center gap-1">
                <span>🔒</span>
                Supported formats: JPG, PNG, GIF (Max 10MB) - Only one image allowed
            </p>
        </div>
    </div>
</template>

<style scoped>
.uploader-wrapper {
    display: inline-block;
}

.uploader-wrapper :deep() button {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.uploader-wrapper :deep() button:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
    background: linear-gradient(135deg, #2563eb, #1e40af);
}

.uploader-wrapper :deep() button:active {
    transform: translateY(0);
}

/* Make the upload area more visually appealing */
.upload-area {
    position: relative;
}

.upload-area::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border-radius: 24px;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.upload-area:hover::before {
    opacity: 0.1;
}

.image-preview {
    animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>