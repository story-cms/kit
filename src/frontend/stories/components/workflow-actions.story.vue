<template>
  <Story title="Workflow Buttons" group="stories" :layout="{ type: 'grid', width: 500 }">
    <Variant title="Admin no review draft submitted" :setup-app="loadData">
      <WorkflowActions :has-edit-review="false" />
    </Variant>
    <Variant title="Admin has review draft submitted" :setup-app="loadData">
      <WorkflowActions :has-edit-review="true" />
    </Variant>
    <Variant title="Editor has review draft submitted" :setup-app="loadData">
      <WorkflowActions :has-edit-review="true" />
    </Variant>
    <Variant title="Editor no review draft submitted" :setup-app="loadData">
      <WorkflowActions :has-edit-review="false" />
    </Variant>
    <Variant title="Admin no review draft started" :setup-app="loadData">
      <WorkflowActions :has-edit-review="false" />
    </Variant>
    <Variant title="Admin no review draft started" :setup-app="loadData">
      <WorkflowActions :has-edit-review="false" />
    </Variant>
    <Variant title="Admin has review draft started" :setup-app="loadData">
      <WorkflowActions :has-edit-review="true" />
    </Variant>
    <Variant title="Editor has review draft started" :setup-app="loadData">
      <WorkflowActions :has-edit-review="true" />
    </Variant>
    <Variant title="Editor no review draft started" :setup-app="loadData">
      <WorkflowActions :has-edit-review="false" />
    </Variant>
    <Variant title="Admin no review draft started" :setup-app="loadData">
      <WorkflowActions :has-edit-review="false" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import WorkflowActions from './workflow-actions.vue';
import { useSharedStore, useDraftsStore } from '../../store';
import { sharedProps } from '../../test/mocks';

import type { StoryHandler } from '../../shared/helpers';

const loadData: StoryHandler = ({ variant }): void => {
  const shared = useSharedStore();
  const drafts = useDraftsStore();

  shared.setFromProps(sharedProps);
  if (variant?.title === 'Admin no review draft submitted') {
    shared.user.role = 'admin';
    drafts.draft.status = 'submitted';
  }
  if (variant?.title === 'Admin has review draft submitted') {
    shared.user.role = 'admin';
    drafts.draft.status = 'submitted';
  }
  if (variant?.title === 'Editor has review draft submitted') {
    shared.user.role = 'editor';
    drafts.draft.status = 'submitted';
  }
  if (variant?.title === 'Editor no review draft submitted') {
    shared.user.role = 'editor';
    drafts.draft.status = 'submitted';
  }

  if (variant?.title === 'Admin no review draft started') {
    shared.user.role = 'admin';
    drafts.draft.status = 'started';
  }
  if (variant?.title === 'Admin has review draft started') {
    shared.user.role = 'admin';
    drafts.draft.status = 'started';
  }
  if (variant?.title === 'Editor has review draft started') {
    shared.user.role = 'editor';
    drafts.draft.status = 'started';
  }
  if (variant?.title === 'Editor no review draft started') {
    shared.user.role = 'editor';
    drafts.draft.status = 'started';
  }
};
</script>
