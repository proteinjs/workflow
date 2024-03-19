import { Loadable, SourceRepository } from '@brentbahry/reflection';

export const getSpannerConfig = () => SourceRepository.get().object<SpannerConfig>('@proteinjs/db-driver-spanner/SpannerConfig');

export type SpannerConfig = Loadable & {
  projectId: string,
  instanceName: string,
  databaseName: string,
}