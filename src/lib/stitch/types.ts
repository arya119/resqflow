export interface StitchScreen {
  name: string;
  title: string;
  screenshot?: {
    name?: string;
    downloadUrl?: string;
  };
  htmlCode?: {
    name?: string;
    downloadUrl?: string;
    mimeType?: string;
  };
  width?: string;
  height?: string;
  deviceType?: string;
}

export interface StitchProject {
  name: string;
  title: string;
  visibility: string;
  createTime: string;
  updateTime: string;
  projectType: string;
  deviceType: string;
  screens?: StitchScreen[];
}

export interface StitchListScreensResponse {
  screens: StitchScreen[];
}

export type StitchGetScreenResponse = StitchScreen;
