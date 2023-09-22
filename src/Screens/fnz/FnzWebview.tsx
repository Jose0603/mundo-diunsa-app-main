import { Box } from 'native-base';
import * as React from 'react';
import { WebView } from 'react-native-webview';

export const FnzWebview: () => JSX.Element = () => {
  return <WebView style={{ flex: 1 }} source={{ uri: 'https://finanzas.diunsa.hn' }} />;
};
