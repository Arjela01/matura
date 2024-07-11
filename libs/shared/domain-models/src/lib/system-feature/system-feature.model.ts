export interface SystemFeatureModel {
  name?: string;
  isAvailable?: boolean;
  availableFrom?: Date;
  availableTo?: Date;
  id?: number;
}

export interface SystemFeatView {
  data: SystemFeatureModel[];
}
