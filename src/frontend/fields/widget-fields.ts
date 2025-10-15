import NullField from './null-field.vue';
import StringField from './string-field.vue';
import AudioField from './audio-field.vue';
import MarkdownField from './markdown-field.vue';
import ImageField from './image-field.vue';
import AnimationField from './animation-field.vue';
import PanelField from './panel-field.vue';
import ListField from './list-field.vue';
import ObjectField from './object-field.vue';
import ScriptureField from './scripture-field.vue';
import ScriptureReferenceField from './scripture-reference-field.vue';
import BooleanField from './boolean-field.vue';
import SelectField from './select-field.vue';
import NumberField from './number-field.vue';
import VideoField from './video-field.vue';
import DateField from './date-field.vue';
import TagField from './tag-field.vue';

export const widgetField = (widget: string) => {
  const up = widget[0].toUpperCase() + widget.substring(1);
  const name = `${up}Field`;

  switch (name) {
    // custom fields

    // non-custom fields
    case 'StringField':
      return StringField;
    case 'AudioField':
      return AudioField;
    case 'ImageField':
      return ImageField;
    case 'MarkdownField':
      return MarkdownField;
    case 'PanelField':
      return PanelField;
    case 'ListField':
      return ListField;
    case 'ObjectField':
      return ObjectField;
    case 'ScriptureField':
      return ScriptureField;
    case 'ScriptureReferenceField':
      return ScriptureReferenceField;
    case 'BooleanField':
      return BooleanField;
    case 'SelectField':
      return SelectField;
    case 'NumberField':
      return NumberField;
    case 'AnimationField':
      return AnimationField;
    case 'VideoField':
      return VideoField;
    case 'DateField':
      return DateField;
    case 'TagField':
      return TagField;
    default:
      return NullField;
  }
};
