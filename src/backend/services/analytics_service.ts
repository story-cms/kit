import { BetaAnalyticsDataClient } from '@google-analytics/data';
import vine from '@vinejs/vine';

export const emptyReport: any[] = [
  {
    name: 'Total Installs',
    stat: 0,
    previousStat: 0,
  },
  {
    name: 'Monthly Active Users',
    stat: 0,
    previousStat: 0,
  },
  {
    name: 'Chapters Complete',
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
   * Generates an analytics report with key metrics
   */
  async report(chapterCompleteEventName: string): Promise<any[]> {
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
    const [totalInstalls, monthlyActiveUsers, chaptersComplete] = await Promise.all([
      this.fetchMetricsForBothPeriods('totalUsers'),
      this.fetchMetricsForBothPeriods('activeUsers'),
      this.fetchMetricsForBothPeriods('eventCount', eventDimensionFilter),
    ]);

    return [
      {
        name: 'Total Installs',
        stat: totalInstalls.current,
        previousStat: totalInstalls.previous,
      },
      {
        name: 'Monthly Active Users',
        stat: monthlyActiveUsers.current,
        previousStat: monthlyActiveUsers.previous,
      },
      {
        name: 'Chapters Complete',
        stat: chaptersComplete.current,
        previousStat: chaptersComplete.previous,
      },
    ];
  }

  /**
   * Initializes the Analytics client with credentials from the
   * GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable (Base64 encoded JSON string)
   * @returns A promise that resolves when initialization is complete
   */
  private async initializeClient(): Promise<void> {
    // Check if credentials are provided as JSON in environment variable
    const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '';

    // base64 decode
    const decoded = Buffer.from(credentialsJson, 'base64').toString('utf-8');

    // Parse credentials from environment variable
    const credentials: GoogleServiceAccountCredentials = JSON.parse(decoded);

    // Create a new BetaAnalyticsDataClient with the parsed credentials
    this.client = new BetaAnalyticsDataClient({
      credentials: credentials,
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
  private createBaseSpec() {
    const appsFilter = {
      fieldName: 'streamName',
      inListFilter: {
        values: this.config.streams,
      },
    };

    return {
      property: `properties/${this.config.propertyId}`,
      dimensions: [
        {
          name: 'streamName',
        },
      ],
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
  ): Promise<{ current: number; previous: number }> {
    const baseSpec = this.createBaseSpec();
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

export type GoogleServiceAccountCredentials = {
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

export function defineConfig(config: AnalyticsConfig): AnalyticsConfig {
  return config;
}
