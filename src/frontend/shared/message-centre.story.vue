<template>
  <Story title="Message" group="shared">
    <Variant title="Failure">
      <MessageCentre
        :response="ResponseStatus.Failure"
        :message="'Oh no, you broke the internet'"
      />
    </Variant>
    <Variant title="Confirmation">
      <MessageCentre
        :response="ResponseStatus.Confirmation"
        :message="'Yes this was done'"
      />
    </Variant>
    <Variant title="Accomplishment">
      <MessageCentre
        :response="ResponseStatus.Accomplishment"
        :message="'You achieved a thing!'"
      />
    </Variant>
    <Variant title="Neutral">
      <MessageCentre
        :response="ResponseStatus.Neutral"
        :message="'Neutral feedback point'"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import MessageCentre from './message-centre.vue';
import { ResponseStatus } from '../../constants';
</script>
