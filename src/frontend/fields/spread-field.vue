<template>
  <div class="grid py-8 pt-2">
    <SelectField
      :field="selectSpec"
      :rootPath="props.rootPath"
      :is-nested="true"
      :is-read-only="props.isReadOnly"
      class="px-8"
    />

    <ScriptureField
      v-if="isScriptureSpread"
      :field="scriptureSpec"
      :rootPath="props.rootPath"
      :is-nested="true"
      :is-read-only="props.isReadOnly"
      class="mt-2 px-8"
    />

    <StringField
      v-if="isScriptureSpread"
      :field="calloutSpec"
      :rootPath="props.rootPath"
      :is-nested="true"
      :is-read-only="props.isReadOnly"
      class="px-8"
    />

    <StringField
      v-if="!isScriptureSpread"
      :field="titleSpec"
      :rootPath="props.rootPath"
      :is-nested="true"
      :is-read-only="props.isReadOnly"
      class="px-8"
    />

    <StringField
      :field="subtitleSpec"
      :rootPath="props.rootPath"
      :is-nested="true"
      :is-read-only="props.isReadOnly"
      class="px-8"
    />

    <p v-if="hasNotesError" class="px-8 pt-8 text-sm text-error">
      {{ notesErrors[0] }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  SelectField,
  ScriptureField,
  StringField,
  commonProps,
  useModelStore,
  useSharedStore,
} from '@story-cms/kit/ui';
import type { FieldSpec } from '@story-cms/kit';

const props = defineProps({
  ...commonProps,
});

enum SpreadType {
  Scripture = 'scripture',
  Special = 'stopAndThink',
}

const selectSpec: FieldSpec = {
  label: 'Spread type',
  name: 'type',
  widget: 'select',
  options: [
    { label: 'Scripture', value: SpreadType.Scripture },
    { label: 'Non-scripture', value: SpreadType.Special },
  ],
  default: 'scripture',
};

const scriptureSpec: FieldSpec = {
  label: 'Scripture',
  name: 'scripture',
  widget: 'scripture',
};

const calloutSpec: FieldSpec = {
  label: 'Callout',
  name: 'callout',
  widget: 'string',
};

const subtitleSpec: FieldSpec = {
  label: 'Sub-title',
  name: 'subtitle',
  widget: 'string',
};

const titleSpec: FieldSpec = {
  label: 'Title',
  name: 'title',
  widget: 'string',
};

const emptySpecial = {
  type: SpreadType.Special,
  subtitle: '',
  title: '',
};

const emptyScripture = {
  type: SpreadType.Scripture,
  scripture: {
    reference: '',
    verse: '',
  },
  title: '',
  subtitle: '',
  callout: '',
};

const shared = useSharedStore();

const selectPath = computed(() => `${props.rootPath}.type`);
const referencePath = computed(() => `${props.rootPath}.${scriptureSpec.name}.reference`);
const notesPath = computed(() => `${props.rootPath}.notes`);
const titlePath = computed(() => `${props.rootPath}.title`);

const isScriptureSpread = computed(() => {
  return selection.value === SpreadType.Scripture;
});

const model = useModelStore();

const selection = props.isReadOnly
  ? ref(model.getSourceField(selectPath.value, selectSpec.default))
  : ref(model.getField(selectPath.value, selectSpec.default));
// const reference = ref(model.getField(referencePath.value, ''));
const reference = props.isReadOnly
  ? ref(model.getSourceField(referencePath.value, ''))
  : ref(model.getField(referencePath.value, ''));

if (!props.isReadOnly && isScriptureSpread.value) {
  model.setField(`${props.rootPath}.title`, reference.value);
  if (!model.isPopulated(`${props.rootPath}.isInsert`)) {
    model.setField(`${props.rootPath}.isInsert`, false);
  }
}

const scriptureIsInsert = (): boolean => {
  if (props.isReadOnly) return false;
  if (!isScriptureSpread.value) return false;

  const passageRef = model.getField(`passage.reference`, '') as string;
  const spreadRef = reference.value as string;
  return passageRef.split(' ')[0] !== spreadRef.split(' ')[0];
};

const notesErrors = computed(() => shared.errorMessages(notesPath.value));
const hasNotesError = computed(() => notesErrors.value.length > 0 && !props.isReadOnly);

model.$subscribe(() => {
  // beware! this can cause an infinite loop

  if (props.isReadOnly) return;

  const freshSelection = model.getField(selectPath.value, selectSpec.default);
  const selectionChanged = selection.value !== freshSelection;

  const freshReference = model.getField(referencePath.value, '');
  if (!selectionChanged && reference.value === freshReference) return;

  if (!selectionChanged) {
    if (isScriptureSpread.value) {
      reference.value = freshReference;
      const isInsert = scriptureIsInsert();
      model.setField(`${props.rootPath}.isInsert`, isInsert);
      model.setField(titlePath.value, reference.value);
    }
    return;
  }

  // the selection changed
  selection.value = freshSelection;
  const notes = model.getField(notesPath.value, '');
  if (isScriptureSpread.value) {
    let fresh = { ...emptyScripture, notes };
    model.setField(`${props.rootPath}`, fresh);
  } else {
    let fresh = { ...emptySpecial, notes };
    model.setField(`${props.rootPath}`, fresh);
  }
});
</script>
