import { AiService } from './ai_service.js';

let aiServiceFactory: () => AiService = () => new AiService();

// Test seam, mirroring #services/cms's setMockCms/resetCms: swaps the
// AiService instance every caller (ChapterTranslationService, UiService, and
// anything that calls them, like the TranslateChapter job) talks to, so
// tests can exercise real translate()/estimate() flows without hitting the
// real OpenAI API. Shared across services so one mock covers all of them.
export function getAiService(): AiService {
  return aiServiceFactory();
}

export function setMockAiService(factory: () => AiService) {
  aiServiceFactory = factory;
}

export function resetAiService() {
  aiServiceFactory = () => new AiService();
}
