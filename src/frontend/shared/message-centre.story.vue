<template>
  <Story title="Message" group="shared">
    <Variant title="Empty">
      <div class="bg-white p-20">
        <MessageCentre :response="ResponseStatus.None" message="" />
      </div>
    </Variant>
    <Variant title="Failure">
      <div class="bg-white p-20">
        <MessageCentre
          :response="ResponseStatus.Failure"
          :message="'Oh no, you broke the internet'"
        />
      </div>
    </Variant>
    <Variant title="Failure with description">
      <div class="bg-white p-20">
        <MessageCentre
          :response="ResponseStatus.Failure"
          :message="'Error saving page'"
          :description="'Check your connection and try again. Contact support if the problem persists.'"
        />
      </div>
    </Variant>
    <Variant title="Confirmation">
      <div class="bg-white p-20">
        <MessageCentre
          :response="ResponseStatus.Confirmation"
          :message="'Yes this was done'"
        />
      </div>
    </Variant>
    <Variant title="Confirmation with description">
      <div class="bg-white p-20">
        <MessageCentre
          :response="ResponseStatus.Confirmation"
          :message="'Your languages have been added'"
          :description="'Remember, once you’ve translated your content you’ll need to request an app update to make these live for your users.'"
        />
      </div>
    </Variant>
    <Variant title="Accomplishment">
      <div class="bg-white p-20">
        <MessageCentre
          :response="ResponseStatus.Accomplishment"
          :message="'You achieved a thing!'"
        />
      </div>
    </Variant>
    <Variant title="Accomplishment with description">
      <div class="bg-white p-20">
        <MessageCentre
          :response="ResponseStatus.Accomplishment"
          :message="'Language added'"
          :description="'Remember, once you’ve translated your content you’ll need to request an app update to make these live for your users.'"
        />
      </div>
    </Variant>
    <Variant title="Neutral">
      <div class="bg-white p-20">
        <MessageCentre
          :response="ResponseStatus.Neutral"
          :message="'Neutral feedback point'"
        />
      </div>
    </Variant>
    <Variant title="Neutral with description">
      <div class="bg-white p-20">
        <MessageCentre
          :response="ResponseStatus.Neutral"
          :message="'Remember to wash behind your ears'"
          :description="'This is an informational reminder with no action required.'"
        />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import MessageCentre from './message-centre.vue';
import { ResponseStatus } from '../../types';
</script>
