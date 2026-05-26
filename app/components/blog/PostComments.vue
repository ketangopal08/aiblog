<script setup lang="ts">
import type { PostModel } from '~/models/PostModel'

const props = defineProps<{ post: PostModel }>()
const { $wp } = useNuxtApp()

const { data: comments, refresh } = await useAsyncData(
  `comments-${props.post.id}`,
  () => $wp.getComments(props.post.id)
)

const form = reactive({ author: '', email: '', content: '' })
const submitting = ref(false)
const submitted = ref(false)
const submitError = ref('')

function formattedCommentDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function sanitize(html: string): string {
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

async function submit() {
  submitError.value = ''
  submitting.value = true
  try {
    await $wp.postComment(props.post.id, form)
    submitted.value = true
    form.author = ''
    form.email = ''
    form.content = ''
    refresh()
  } catch (err: any) {
    submitError.value = err?.data?.message ?? 'Failed to submit comment. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="mt-10 pt-6 border-t border-gray-200 dark:border-[#222]">

    <h3 class="text-[11px] font-black uppercase tracking-[3px] text-gray-900 dark:text-white mb-6">
      {{ comments?.length ? `${comments.length} Comment${comments.length !== 1 ? 's' : ''}` : 'Comments' }}
    </h3>

    <!-- Comments list -->
    <div v-if="comments?.length" class="flex flex-col gap-0 mb-10">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="flex gap-4 py-5 border-b border-gray-100 dark:border-white/[0.06]"
      >
        <img
          v-if="comment.avatarUrl"
          :src="comment.avatarUrl"
          :alt="comment.author"
          class="w-9 h-9 rounded-full flex-shrink-0 bg-gray-200 dark:bg-[#1a1a1a]"
        />
        <div v-else class="w-9 h-9 rounded-full flex-shrink-0 bg-gray-200 dark:bg-[#1a1a1a] flex items-center justify-center text-[13px] font-bold text-gray-500 dark:text-gray-400">
          {{ comment.author[0]?.toUpperCase() ?? '?' }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-baseline gap-2 mb-1.5">
            <span class="text-[13px] font-bold text-gray-900 dark:text-white">{{ comment.author }}</span>
            <span class="text-[11px] text-gray-400 dark:text-gray-500">{{ formattedCommentDate(comment.date) }}</span>
          </div>
          <div
            class="text-[14px] text-gray-700 dark:text-gray-300 leading-relaxed prose-sm"
            v-html="sanitize(comment.content)"
          />
        </div>
      </div>
    </div>

    <div v-else class="mb-10 text-sm text-gray-500 dark:text-gray-400 py-6 text-center border border-dashed border-gray-200 dark:border-white/[0.08]">
      No comments yet. Be the first to share your thoughts.
    </div>

    <!-- Comment form -->
    <div>
      <h4 class="text-[11px] font-black uppercase tracking-[3px] text-gray-900 dark:text-white mb-5">
        Leave a Comment
      </h4>

      <div v-if="submitted" class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/[0.08] px-4 py-4">
        Your comment has been submitted and is awaiting moderation. Thank you!
      </div>

      <form v-else @submit.prevent="submit" class="flex flex-col gap-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="comment-name" class="block text-[11px] font-bold uppercase tracking-[1.5px] text-gray-500 dark:text-gray-400 mb-1.5">
              Name <span class="text-red-500">*</span>
            </label>
            <input
              id="comment-name"
              v-model="form.author"
              type="text"
              required
              autocomplete="name"
              class="w-full bg-transparent border border-gray-200 dark:border-white/[0.1] px-3 py-2.5 text-[14px]
                     text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600
                     outline-none focus:border-primary transition-colors"
              placeholder="Your name"
            />
          </div>
          <div>
            <label for="comment-email" class="block text-[11px] font-bold uppercase tracking-[1.5px] text-gray-500 dark:text-gray-400 mb-1.5">
              Email <span class="text-red-500">*</span>
              <span class="normal-case font-normal">(not published)</span>
            </label>
            <input
              id="comment-email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              class="w-full bg-transparent border border-gray-200 dark:border-white/[0.1] px-3 py-2.5 text-[14px]
                     text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600
                     outline-none focus:border-primary transition-colors"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label for="comment-content" class="block text-[11px] font-bold uppercase tracking-[1.5px] text-gray-500 dark:text-gray-400 mb-1.5">
            Comment <span class="text-red-500">*</span>
          </label>
          <textarea
            id="comment-content"
            v-model="form.content"
            required
            rows="5"
            class="w-full bg-transparent border border-gray-200 dark:border-white/[0.1] px-3 py-2.5 text-[14px]
                   text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600
                   outline-none focus:border-primary transition-colors resize-y"
            placeholder="Share your thoughts…"
          />
        </div>

        <div v-if="submitError" class="text-sm text-red-500 dark:text-red-400">
          {{ submitError }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="submitting"
            class="bg-primary text-white px-6 py-2.5 text-[11px] font-black uppercase tracking-[2px]
                   hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="submitting" class="flex items-center gap-2">
              <svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Submitting…
            </span>
            <span v-else>Post Comment</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
