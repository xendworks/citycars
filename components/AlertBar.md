# AlertBar Component Usage Guide

A beautiful, reusable alert bar component with multiple types, icons, and actions.

## Features

✅ **4 Alert Types:** `success`, `error`, `warning`, `info`  
✅ **Auto Icons:** Automatically shows the right icon for each type  
✅ **Smooth Transitions:** Beautiful slide-in/out animations  
✅ **Action Buttons:** Optional action and dismiss buttons  
✅ **Auto-Dismiss:** Optional auto-dismiss after delay  
✅ **Fully Typed:** Complete TypeScript support  
✅ **Customizable:** Props for title, message, buttons, etc.

---

## Basic Usage

```vue
<template>
  <AlertBar
    :show="showAlert"
    type="success"
    title="Success!"
    message="Your action was completed successfully."
  />
</template>

<script setup>
import { ref } from 'vue'

const showAlert = ref(true)
</script>
```

---

## Alert Types

### Success Alert (Green)
```vue
<AlertBar
  type="success"
  title="Order Completed"
  message="Your order has been successfully processed."
/>
```

### Error Alert (Red)
```vue
<AlertBar
  type="error"
  title="Error Occurred"
  message="Something went wrong. Please try again."
/>
```

### Warning Alert (Yellow)
```vue
<AlertBar
  type="warning"
  title="Warning"
  message="Please review your information before proceeding."
/>
```

### Info Alert (Blue)
```vue
<AlertBar
  type="info"
  title="Information"
  message="Your session will expire in 5 minutes."
/>
```

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `show` | `boolean` | `true` | Controls visibility (supports v-model) |
| `type` | `'success' \| 'error' \| 'warning' \| 'info'` | `'success'` | Alert type (changes color & icon) |
| `title` | `string` | **Required** | Alert title/heading |
| `message` | `string` | `''` | Optional message text |
| `actionText` | `string` | `''` | Text for action button (if provided) |
| `showDismiss` | `boolean` | `false` | Show "Dismiss" button |
| `showClose` | `boolean` | `true` | Show close (X) button |
| `autoDismiss` | `boolean` | `false` | Auto-dismiss after delay |
| `dismissDelay` | `number` | `5000` | Delay before auto-dismiss (ms) |

---

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `dismiss` | None | Emitted when alert is dismissed |
| `action` | None | Emitted when action button is clicked |
| `update:show` | `boolean` | Emitted for v-model support |

---

## Advanced Examples

### With Action Buttons
```vue
<AlertBar
  :show="showAlert"
  type="success"
  title="Account Deleted Successfully"
  message="Your account has been permanently deleted."
  actionText="Go to Home"
  showDismiss
  @action="goHome"
  @dismiss="showAlert = false"
/>
```

### Auto-Dismiss Alert
```vue
<AlertBar
  :show="showNotification"
  type="info"
  title="Profile Updated"
  message="Your changes have been saved."
  :autoDismiss="true"
  :dismissDelay="3000"
  @dismiss="showNotification = false"
/>
```

### With Close Button Only
```vue
<AlertBar
  :show="showWarning"
  type="warning"
  title="Unsaved Changes"
  message="You have unsaved changes. Are you sure you want to leave?"
  :showClose="true"
  @dismiss="showWarning = false"
/>
```

### Error with Action
```vue
<AlertBar
  :show="showError"
  type="error"
  title="Payment Failed"
  message="We couldn't process your payment. Please try again."
  actionText="Retry Payment"
  showDismiss
  @action="retryPayment"
  @dismiss="showError = false"
/>
```

---

## Real-World Examples

### Form Submission Success
```vue
<script setup>
import { ref } from 'vue'

const showSuccess = ref(false)

const submitForm = async () => {
  try {
    await api.submit()
    showSuccess.value = true
  } catch (err) {
    // handle error
  }
}
</script>

<template>
  <div>
    <AlertBar
      v-if="showSuccess"
      type="success"
      title="Form Submitted"
      message="We've received your submission and will get back to you soon."
      :autoDismiss="true"
      :dismissDelay="5000"
    />
    
    <form @submit.prevent="submitForm">
      <!-- form fields -->
    </form>
  </div>
</template>
```

### Delete Confirmation Result
```vue
<script setup>
const showDeleteSuccess = ref(false)

const deleteItem = async () => {
  await api.delete()
  showDeleteSuccess.value = true
}
</script>

<template>
  <AlertBar
    :show="showDeleteSuccess"
    type="success"
    title="Item Deleted"
    message="The item has been permanently removed."
    actionText="Undo"
    showDismiss
    @action="undoDelete"
    @dismiss="showDeleteSuccess = false"
  />
</template>
```

---

## Styling

The component uses Tailwind CSS and automatically applies the correct colors based on the `type` prop:

- **Success:** Green (`bg-green-50`, `text-green-800`, etc.)
- **Error:** Red (`bg-red-50`, `text-red-800`, etc.)
- **Warning:** Yellow (`bg-yellow-50`, `text-yellow-800`, etc.)
- **Info:** Blue (`bg-blue-50`, `text-blue-800`, etc.)

Icons are from `@heroicons/vue/20/solid` and change automatically based on type.

---

## Tips

1. **Use auto-dismiss for non-critical notifications** (success messages, info)
2. **Don't auto-dismiss errors or warnings** - let users manually dismiss them
3. **Use action buttons for next steps** (e.g., "View Details", "Go to Dashboard")
4. **Keep titles short** (1-3 words) and messages concise
5. **Use the right type** - don't use `success` for errors!

---

## Component Dependencies

- `@heroicons/vue` (version 2.x)
- Tailwind CSS
- Vue 3

