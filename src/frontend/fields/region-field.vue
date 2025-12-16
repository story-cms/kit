<template>
  <PillField
    v-bind="props"
    :pills="tags"
    :errors="errors"
    :input-value="newTag"
    :display-text="getRegionName"
    @remove="removeTag"
    @update:input-value="newTag = $event"
    @keydown:enter="handleEnter"
    @keydown:arrow-down="navigateDown"
    @keydown:arrow-up="navigateUp"
    @keydown:escape="hideSuggestions"
    @input="showSuggestions"
    @focus="showSuggestions"
    @blur="handleBlur"
  >
    <template #dropdown>
      <div
        v-if="showDropdown && filteredRegions.length > 0 && !props.isReadOnly"
        class="absolute z-10 py-1 mt-1 w-full bg-white rounded-md border border-gray-300 shadow-lg"
      >
        <button
          v-for="(region, index) in filteredRegions"
          :key="region.code"
          type="button"
          :class="[
            'w-full px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ltr:text-left rtl:text-right',
            selectedIndex === index ? 'bg-gray-100' : '',
          ]"
          @click="selectRegion(region.code)"
          @mouseenter="selectedIndex = index"
        >
          <span class="font-medium">{{ region.code }}</span>
          <span class="text-gray-600 ltr:ml-2 rtl:mr-2">{{ region.name }}</span>
        </button>
      </div>
    </template>
  </PillField>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { FieldSpec } from '../../types';
import { useModelStore, useSharedStore } from '../store/index';
import { commonProps } from '../shared/helpers';
import PillField from './pill/pill-field.vue';

const props = defineProps({
  ...commonProps,
});

const model = useModelStore();
const shared = useSharedStore();
const newTag = ref('');
const showDropdown = ref(false);
const selectedIndex = ref(-1);

const field = computed(() => props.field as FieldSpec);
const fieldPath = computed(() => {
  if (props.rootPath === undefined) return field.value.name;
  return `${props.rootPath}.${field.value.name}`;
});

const modelValue = computed(() => {
  return props.isReadOnly
    ? model.getSourceField(fieldPath.value, '')
    : model.getField(fieldPath.value, '');
});

const regions = computed(() => {
  return data.map((item) => {
    const code = Object.keys(item)[0];
    const name = item[code as keyof typeof item] as string;
    return { code, name };
  });
});

const filteredRegions = computed(() => {
  if (!newTag.value.trim()) return [];

  const searchTerm = newTag.value.toLowerCase().trim();
  return regions.value
    .filter(
      (region) =>
        !tags.value.includes(region.code) &&
        (region.name?.toLowerCase().includes(searchTerm) ||
          region.code.toLowerCase().includes(searchTerm)),
    )
    .slice(0, 6);
});

const findRegionCode = (searchTerm: string): string | null => {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return null;

  let region = regions.value.find(
    (r) => r.name?.toLowerCase() === term || r.code.toLowerCase() === term,
  );

  if (!region) {
    region = regions.value.find(
      (r) => r.name?.toLowerCase().includes(term) || r.code.toLowerCase().includes(term),
    );
  }

  return region?.code ?? null;
};

const getRegionName = (code: string): string => {
  const region = regions.value.find((r) => r.code === code);
  return region?.name ?? code;
};

const handleAdd = (value: string) => {
  if (value.length === 0) return;
  const regionCode = findRegionCode(value);
  if (regionCode) {
    addTag(regionCode);
  } else {
    newTag.value = '';
  }
};

const addTag = (code: string) => {
  if (tags.value.includes(code)) return;
  const currentTags = [...tags.value, code];
  model.setField(fieldPath.value, currentTags.join(','));
  newTag.value = '';
  hideSuggestions();
};

const removeTag = (tag: string) => {
  const newTags = tags.value.filter((t: string) => t !== tag);
  model.setField(fieldPath.value, newTags.join(','));
};

const selectRegion = (code: string) => {
  addTag(code);
};

const showSuggestions = () => {
  if (!props.isReadOnly && newTag.value.trim()) {
    showDropdown.value = true;
    selectedIndex.value = -1;
  }
};

const hideSuggestions = () => {
  setTimeout(() => {
    showDropdown.value = false;
    selectedIndex.value = -1;
  }, 200);
};

const handleBlur = () => {
  hideSuggestions();
};

const handleEnter = (event: KeyboardEvent) => {
  if (
    showDropdown.value &&
    selectedIndex.value >= 0 &&
    filteredRegions.value[selectedIndex.value]
  ) {
    selectRegion(filteredRegions.value[selectedIndex.value].code);
    event.preventDefault();
    event.stopPropagation();
  } else if (newTag.value.trim()) {
    handleAdd(newTag.value);
    event.preventDefault();
    event.stopPropagation();
  }
};

const navigateDown = () => {
  if (!showDropdown.value || filteredRegions.value.length === 0) {
    showSuggestions();
    return;
  }
  selectedIndex.value = Math.min(
    selectedIndex.value + 1,
    filteredRegions.value.length - 1,
  );
};

const navigateUp = () => {
  if (!showDropdown.value || filteredRegions.value.length === 0) return;
  selectedIndex.value = Math.max(selectedIndex.value - 1, -1);
};

watch(newTag, (value) => {
  if (value.trim() && !props.isReadOnly) {
    showDropdown.value = true;
    selectedIndex.value = -1;
  } else {
    showDropdown.value = false;
    selectedIndex.value = -1;
  }

  if (value.endsWith(',')) {
    const newValue = value.slice(0, -1).trim();
    const regionCode = findRegionCode(newValue);
    if (regionCode) {
      addTag(regionCode);
    } else {
      newTag.value = '';
    }
  }
});

const errors = computed(() => shared.errorMessages(fieldPath.value));

const tags = computed(() => {
  const tagString = modelValue.value;
  if (!tagString || typeof tagString !== 'string' || tagString.length === 0) return [];
  return tagString.split(',').map((t: string) => t.trim());
});

const data = [
  { AD: 'Andorra' },
  { AE: 'United Arab Emirates' },
  { AF: 'Afghanistan' },
  { AG: 'Antigua and Barbuda' },
  { AI: 'Anguilla' },
  { AL: 'Albania' },
  { AM: 'Armenia' },
  { AO: 'Angola' },
  { AQ: 'Antarctica' },
  { AR: 'Argentina' },
  { AS: 'American Samoa' },
  { AT: 'Austria' },
  { AU: 'Australia' },
  { AW: 'Aruba' },
  { AX: 'Åland Islands' },
  { AZ: 'Azerbaijan' },
  { BA: 'Bosnia and Herzegovina' },
  { BB: 'Barbados' },
  { BD: 'Bangladesh' },
  { BE: 'Belgium' },
  { BF: 'Burkina Faso' },
  { BG: 'Bulgaria' },
  { BH: 'Bahrain' },
  { BI: 'Burundi' },
  { BJ: 'Benin' },
  { BL: 'Saint Barthélemy' },
  { BM: 'Bermuda' },
  { BN: 'Brunei Darussalam' },
  { BO: 'Bolivia, Plurinational State of' },
  { BQ: 'Bonaire, Sint Eustatius and Saba' },
  { BR: 'Brazil' },
  { BS: 'Bahamas' },
  { BT: 'Bhutan' },
  { BV: 'Bouvet Island' },
  { BW: 'Botswana' },
  { BY: 'Belarus' },
  { BZ: 'Belize' },
  { CA: 'Canada' },
  { CC: 'Cocos (Keeling) Islands' },
  { CD: 'Congo, Democratic Republic of the' },
  { CF: 'Central African Republic' },
  { CG: 'Congo' },
  { CH: 'Switzerland' },
  { CI: "Côte d'Ivoire" },
  { CK: 'Cook Islands' },
  { CL: 'Chile' },
  { CM: 'Cameroon' },
  { CN: 'China' },
  { CO: 'Colombia' },
  { CR: 'Costa Rica' },
  { CU: 'Cuba' },
  { CV: 'Cabo Verde' },
  { CW: 'Curaçao' },
  { CX: 'Christmas Island' },
  { CY: 'Cyprus' },
  { CZ: 'Czechia' },
  { DE: 'Germany' },
  { DJ: 'Djibouti' },
  { DK: 'Denmark' },
  { DM: 'Dominica' },
  { DO: 'Dominican Republic' },
  { DZ: 'Algeria' },
  { EC: 'Ecuador' },
  { EE: 'Estonia' },
  { EG: 'Egypt' },
  { EH: 'Western Sahara' },
  { ER: 'Eritrea' },
  { ES: 'Spain' },
  { ET: 'Ethiopia' },
  { FI: 'Finland' },
  { FJ: 'Fiji' },
  { FK: 'Falkland Islands (Malvinas)' },
  { FM: 'Micronesia, Federated States of' },
  { FO: 'Faroe Islands' },
  { FR: 'France' },
  { GA: 'Gabon' },
  { GB: 'United Kingdom of Great Britain and Northern Ireland' },
  { GD: 'Grenada' },
  { GE: 'Georgia' },
  { GF: 'French Guiana' },
  { GG: 'Guernsey' },
  { GH: 'Ghana' },
  { GI: 'Gibraltar' },
  { GL: 'Greenland' },
  { GM: 'Gambia' },
  { GN: 'Guinea' },
  { GP: 'Guadeloupe' },
  { GQ: 'Equatorial Guinea' },
  { GR: 'Greece' },
  { GS: 'South Georgia and the South Sandwich Islands' },
  { GT: 'Guatemala' },
  { GU: 'Guam' },
  { GW: 'Guinea-Bissau' },
  { GY: 'Guyana' },
  { HK: 'Hong Kong' },
  { HM: 'Heard Island and McDonald Islands' },
  { HN: 'Honduras' },
  { HR: 'Croatia' },
  { HT: 'Haiti' },
  { HU: 'Hungary' },
  { ID: 'Indonesia' },
  { IE: 'Ireland' },
  { IL: 'Israel' },
  { IM: 'Isle of Man' },
  { IN: 'India' },
  { IO: 'British Indian Ocean Territory' },
  { IQ: 'Iraq' },
  { IR: 'Iran, Islamic Republic of' },
  { IS: 'Iceland' },
  { IT: 'Italy' },
  { JE: 'Jersey' },
  { JM: 'Jamaica' },
  { JO: 'Jordan' },
  { JP: 'Japan' },
  { KE: 'Kenya' },
  { KG: 'Kyrgyzstan' },
  { KH: 'Cambodia' },
  { KI: 'Kiribati' },
  { KM: 'Comoros' },
  { KN: 'Saint Kitts and Nevis' },
  { KP: "Korea, Democratic People's Republic of" },
  { KR: 'Korea, Republic of' },
  { KW: 'Kuwait' },
  { KY: 'Cayman Islands' },
  { KZ: 'Kazakhstan' },
  { LA: "Lao People's Democratic Republic" },
  { LB: 'Lebanon' },
  { LC: 'Saint Lucia' },
  { LI: 'Liechtenstein' },
  { LK: 'Sri Lanka' },
  { LR: 'Liberia' },
  { LS: 'Lesotho' },
  { LT: 'Lithuania' },
  { LU: 'Luxembourg' },
  { LV: 'Latvia' },
  { LY: 'Libya' },
  { MA: 'Morocco' },
  { MC: 'Monaco' },
  { MD: 'Moldova, Republic of' },
  { ME: 'Montenegro' },
  { MF: 'Saint Martin (French part)' },
  { MG: 'Madagascar' },
  { MH: 'Marshall Islands' },
  { MK: 'North Macedonia' },
  { ML: 'Mali' },
  { MM: 'Myanmar' },
  { MN: 'Mongolia' },
  { MO: 'Macao' },
  { MP: 'Northern Mariana Islands' },
  { MQ: 'Martinique' },
  { MR: 'Mauritania' },
  { MS: 'Montserrat' },
  { MT: 'Malta' },
  { MU: 'Mauritius' },
  { MV: 'Maldives' },
  { MW: 'Malawi' },
  { MX: 'Mexico' },
  { MY: 'Malaysia' },
  { MZ: 'Mozambique' },
  { NA: 'Namibia' },
  { NC: 'New Caledonia' },
  { NE: 'Niger' },
  { NF: 'Norfolk Island' },
  { NG: 'Nigeria' },
  { NI: 'Nicaragua' },
  { NL: 'Netherlands' },
  { NO: 'Norway' },
  { NP: 'Nepal' },
  { NR: 'Nauru' },
  { NU: 'Niue' },
  { NZ: 'New Zealand' },
  { OM: 'Oman' },
  { PA: 'Panama' },
  { PE: 'Peru' },
  { PF: 'French Polynesia' },
  { PG: 'Papua New Guinea' },
  { PH: 'Philippines' },
  { PK: 'Pakistan' },
  { PL: 'Poland' },
  { PM: 'Saint Pierre and Miquelon' },
  { PN: 'Pitcairn' },
  { PR: 'Puerto Rico' },
  { PS: 'Palestine, State of' },
  { PT: 'Portugal' },
  { PW: 'Palau' },
  { PY: 'Paraguay' },
  { QA: 'Qatar' },
  { RE: 'Réunion' },
  { RO: 'Romania' },
  { RS: 'Serbia' },
  { RU: 'Russian Federation' },
  { RW: 'Rwanda' },
  { SA: 'Saudi Arabia' },
  { SB: 'Solomon Islands' },
  { SC: 'Seychelles' },
  { SD: 'Sudan' },
  { SE: 'Sweden' },
  { SG: 'Singapore' },
  { SH: 'Saint Helena, Ascension and Tristan da Cunha' },
  { SI: 'Slovenia' },
  { SJ: 'Svalbard and Jan Mayen' },
  { SK: 'Slovakia' },
  { SL: 'Sierra Leone' },
  { SM: 'San Marino' },
  { SN: 'Senegal' },
  { SO: 'Somalia' },
  { SR: 'Suriname' },
  { SS: 'South Sudan' },
  { ST: 'Sao Tome and Principe' },
  { SV: 'El Salvador' },
  { SX: 'Sint Maarten (Dutch part)' },
  { SY: 'Syrian Arab Republic' },
  { SZ: 'Eswatini' },
  { TC: 'Turks and Caicos Islands' },
  { TD: 'Chad' },
  { TF: 'French Southern Territories' },
  { TG: 'Togo' },
  { TH: 'Thailand' },
  { TJ: 'Tajikistan' },
  { TK: 'Tokelau' },
  { TL: 'Timor-Leste' },
  { TM: 'Turkmenistan' },
  { TN: 'Tunisia' },
  { TO: 'Tonga' },
  { TR: 'Turkey' },
  { TT: 'Trinidad and Tobago' },
  { TV: 'Tuvalu' },
  { TW: 'Taiwan, Province of China' },
  { TZ: 'Tanzania, United Republic of' },
  { UA: 'Ukraine' },
  { UG: 'Uganda' },
  { UM: 'United States Minor Outlying Islands' },
  { US: 'United States of America' },
  { UY: 'Uruguay' },
  { UZ: 'Uzbekistan' },
  { VA: 'Holy See (Vatican City State)' },
  { VC: 'Saint Vincent and the Grenadines' },
  { VE: 'Venezuela, Bolivarian Republic of' },
  { VG: 'Virgin Islands (British)' },
  { VI: 'Virgin Islands (U.S.)' },
  { VN: 'Viet Nam' },
  { VU: 'Vanuatu' },
  { WF: 'Wallis and Futuna' },
  { WS: 'Samoa' },
  { YE: 'Yemen' },
  { YT: 'Mayotte' },
  { ZA: 'South Africa' },
  { ZM: 'Zambia' },
  { ZW: 'Zimbabwe' },
];
</script>
