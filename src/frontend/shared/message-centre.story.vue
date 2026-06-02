<template>
  <Story title="Message" group="shared">
    <Variant title="Failure">
      <div class="bg-white p-8">
        <MessageCentre
          :response="ResponseStatus.Failure"
          :message="'Oh no, you broke the internet'"
        />
      </div>
    </Variant>
    <Variant title="Confirmation">
      <div class="bg-white p-8">
        <MessageCentre
          :response="ResponseStatus.Confirmation"
          :message="'Yes this was done'"
        />
      </div>
    </Variant>
    <Variant title="Accomplishment">
      <div class="bg-white p-8">
        <MessageCentre
          :response="ResponseStatus.Accomplishment"
          :message="'You achieved a thing!'"
        />
      </div>
    </Variant>
    <Variant title="Neutral">
      <div class="bg-white p-8">
        <MessageCentre
          :response="ResponseStatus.Neutral"
          :message="'Neutral feedback point'"
        />
      </div>
    </Variant>
    <Variant title="With description">
      <div class="bg-white p-8">
        <MessageCentre
          :response="ResponseStatus.Accomplishment"
          :message="'Language added'"
          :description="'Remember, once you’ve translated your content you’ll need to request an app update to make these live for your users. '"
        />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import MessageCentre from './message-centre.vue';
import { ResponseStatus } from '../../types';
</script>
