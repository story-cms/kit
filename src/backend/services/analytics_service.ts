import { BetaAnalyticsDataClient } from '@google-analytics/data';
import vine from '@vinejs/vine';
import { StatMetric } from '../../types';
import { getCredentialsFrom } from './helpers.js';

/**
 * See: https://support.google.com/analytics/answer/12253918?hl=en
 */
export const emptyAnalyticsReport: StatMetric[] = [
  {
    name: 'New Users',
    stat: 0,
    previousStat: 0,
  },
  {
    name: 'Monthly Active Users',
    stat: 0,
    previousStat: 0,
  },
  {
    name: 'Sessions Completed',
    stat: 0,
    previousStat: 0,
  },
];

export class Analytics {
  protected client!: BetaAnalyticsDataClient;
  protected config: AnalyticsConfig;

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.initializeClient();
  }

  /**
   * Fetches campaign statistics for promotion_impression and promotion_cta_tap events
   * @param campaignId - The campaign ID to filter by
   * @param language - The language code to filter by (e.g., 'en', 'fr')
   * @returns Object with impressions and clicks counts for all time
   */
  async getCampaignStats(
    campaignId: number,
    language: string,
  ): Promise<{ impressions: number; clicks: number }> {
    // Create base filter with stream names
    const appsFilter = {
      fieldName: 'streamName',
      inListFilter: {
        values: this.config.streams,
      },
    };

    // Create campaign ID filter (Custom Event Scope)
    const campaignIdFilter = {
      fieldName: 'customEvent:campaign_id',
      stringFilter: {
        value: String(campaignId),
      },
    };

    // Create language filter (Custom Event Scope)
    const languageFilter = {
      fieldName: 'customEvent:language',
      stringFilter: {
        value: language,
        caseSensitive: false,
      },
    };

    // Create promotion_impression event filter
    const impressionEventFilter = {
      fieldName: 'eventName',
      stringFilter: {
        value: 'promotion_impression',
      },
    };

    // Create promotion_cta_tap event filter
    const ctaTapEventFilter = {
      fieldName: 'eventName',
      stringFilter: {
        value: 'promotion_cta_tap',
      },
    };

    // Combined filter for impressions: stream + event + campaign_id + language
    const impressionDimensionFilter = {
      andGroup: {
        expressions: [
          { filter: appsFilter },
          { filter: impressionEventFilter },
          { filter: campaignIdFilter },
          { filter: languageFilter },
        ],
      },
    };

    // Combined filter for CTA taps: stream + event + campaign_id + language
    const ctaTapDimensionFilter = {
      andGroup: {
        expressions: [
          { filter: appsFilter },
          { filter: ctaTapEventFilter },
          { filter: campaignIdFilter },
          { filter: languageFilter },
        ],
      },
    };

    // We must request the dimensions we are filtering by to ensure accurate event counts
    const eventParameterDimensions = ['customEvent:campaign_id', 'customEvent:language'];

    try {
      // Changed to use fetchMetricsForAllTime
      const [impressions, clicks] = await Promise.all([
        this.fetchMetricsForAllTime(
          'eventCount',
          impressionDimensionFilter,
          eventParameterDimensions,
        ),
        this.fetchMetricsForAllTime(
          'eventCount',
          ctaTapDimensionFilter,
          eventParameterDimensions,
        ),
      ]);

      return {
        impressions,
        clicks,
      };
    } catch (error: any) {
      const errorMessage = error?.message || String(error);
      console.error('Error fetching campaign stats:', errorMessage);

      // Fallback: Try without specific filters if the main query fails
      try {
        const impressionFilterWithoutParams = {
          andGroup: {
            expressions: [{ filter: appsFilter }, { filter: impressionEventFilter }],
          },
        };

        const ctaTapFilterWithoutParams = {
          andGroup: {
            expressions: [{ filter: appsFilter }, { filter: ctaTapEventFilter }],
          },
        };

        // Changed to use fetchMetricsForAllTime
        const [impressions, clicks] = await Promise.all([
          this.fetchMetricsForAllTime('eventCount', impressionFilterWithoutParams),
          this.fetchMetricsForAllTime('eventCount', ctaTapFilterWithoutParams),
        ]);

        console.warn(
          `Campaign stats queried without filters. Falling back to global counts. ` +
            `Ensure 'campaign_id' is registered as a Custom Dimension (Event Scope) and data exists.`,
        );

        return {
          impressions,
          clicks,
        };
      } catch (fallbackError: any) {
        throw new Error(
          `Failed to fetch stats: ${errorMessage}. Fallback failed: ${fallbackError?.message}`,
        );
      }
    }
  }

  /**
   * Generates an analytics report with key metrics
   */
  async report(chapterCompleteEventName: string): Promise<StatMetric[]> {
    // Create chapter event filter for the chapter completion metrics
    const appsFilter = {
      fieldName: 'streamName',
      inListFilter: {
        values: this.config.streams,
      },
    };

    const chapterEventFilter = {
      fieldName: 'eventName',
      stringFilter: {
        value: chapterCompleteEventName,
      },
    };

    const eventDimensionFilter = {
      andGroup: {
        expressions: [
          {
            filter: appsFilter,
          },
          {
            filter: chapterEventFilter,
          },
        ],
      },
    };

    // Run all three metric queries in parallel for better performance
    const [newUsers, monthlyActiveUsers, sessionsCompleted] = await Promise.all([
      this.fetchMetricsForBothPeriods('newUsers'),
      this.fetchMetricsForBothPeriods('activeUsers'),
      this.fetchMetricsForBothPeriods('eventCount', eventDimensionFilter),
    ]);

    return [
      {
        name: 'New Users',
        stat: newUsers.current,
        previousStat: newUsers.previous,
      },
      {
        name: 'Monthly Active Users',
        stat: monthlyActiveUsers.current,
        previousStat: monthlyActiveUsers.previous,
      },
      {
        name: 'Sessions Completed',
        stat: sessionsCompleted.current,
        previousStat: sessionsCompleted.previous,
      },
    ];
  }

  /**
   * Initializes the Analytics client with credentials from the
   * GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable (Base64 encoded JSON string)
   */
  private initializeClient() {
    // Parse credentials from environment variable
    const credentials: GoogleServiceAccountCredentials = getCredentialsFrom(
      'GOOGLE_APPLICATION_CREDENTIALS_JSON',
    );

    // Create a new BetaAnalyticsDataClient with the parsed credentials
    this.client = new BetaAnalyticsDataClient({
      credentials,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });
  }

  // Date range constants
  private readonly CURRENT_PERIOD = {
    startDate: '30daysAgo',
    endDate: 'today',
  };

  private readonly PREVIOUS_PERIOD = {
    startDate: '60daysAgo',
    endDate: '31daysAgo',
  };

  private readonly ALL_TIME_PERIOD = {
    startDate: '2026-01-01',
    endDate: 'today',
  };

  /**
   * Sums metric values across all streams from a GA report
   */
  private sumMetricValues(report: any): number {
    return (
      report?.rows?.reduce((sum: number, row: any) => {
        return sum + Number.parseInt(row.metricValues?.[0]?.value || '0', 10);
      }, 0) || 0
    );
  }

  /**
   * Creates the base specification for GA reports
   */
  private createBaseSpec(additionalDimensions: string[] = []) {
    const appsFilter = {
      fieldName: 'streamName',
      inListFilter: {
        values: this.config.streams,
      },
    };

    const dimensions = [
      {
        name: 'streamName',
      },
      ...additionalDimensions.map((name) => ({ name })),
    ];

    return {
      property: `properties/${this.config.propertyId}`,
      dimensions,
      dimensionFilter: {
        filter: appsFilter,
      },
    };
  }

  /**
   * Fetches metrics for both current and previous periods
   */
  private async fetchMetricsForBothPeriods(
    metricName: string,
    customDimensionFilter?: any,
    additionalDimensions: string[] = [],
  ): Promise<{ current: number; previous: number }> {
    const baseSpec = this.createBaseSpec(additionalDimensions);
    const reportConfig = {
      ...baseSpec,
      metrics: [{ name: metricName }],
    };

    // Apply custom dimension filter if provided
    if (customDimensionFilter) {
      reportConfig.dimensionFilter = customDimensionFilter;
    }

    // Fetch current period data
    const [currentPeriodData] = await this.client.runReport({
      ...reportConfig,
      dateRanges: [this.CURRENT_PERIOD],
    });

    // Fetch previous period data
    const [previousPeriodData] = await this.client.runReport({
      ...reportConfig,
      dateRanges: [this.PREVIOUS_PERIOD],
    });

    return {
      current: this.sumMetricValues(currentPeriodData),
      previous: this.sumMetricValues(previousPeriodData),
    };
  }

  /**
   * Fetches metrics for all time
   */
  private async fetchMetricsForAllTime(
    metricName: string,
    customDimensionFilter?: any,
    additionalDimensions: string[] = [],
  ): Promise<number> {
    const baseSpec = this.createBaseSpec(additionalDimensions);
    const reportConfig = {
      ...baseSpec,
      metrics: [{ name: metricName }],
    };

    if (customDimensionFilter) {
      reportConfig.dimensionFilter = customDimensionFilter;
    }

    const [data] = await this.client.runReport({
      ...reportConfig,
      dateRanges: [this.ALL_TIME_PERIOD],
    });

    return this.sumMetricValues(data);
  }
}

export type AnalyticsConfig = {
  propertyId: string;
  streams: string[];
  chapterCompletionReportKey: string;
  cacheKey: string;
};

export const analyticsConfigSchema = vine.object({
  propertyId: vine.string().trim().minLength(5),
  streams: vine.array(vine.string().trim().minLength(5)).minLength(1),
  chapterCompletionReportKey: vine.string().trim().minLength(3),
  cacheKey: vine.string().trim().minLength(1),
});

type GoogleServiceAccountCredentials = {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
};

export function defineAnalyticsConfig(config: AnalyticsConfig): AnalyticsConfig {
  return config;
}
