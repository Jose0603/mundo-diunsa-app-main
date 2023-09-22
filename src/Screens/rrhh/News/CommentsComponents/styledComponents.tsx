import React from 'react';
import {  Image, Text, View, Platform } from 'react-native';
import {Box} from 'native-base';
// import Svg from 'react-native-svg';
import styled from 'styled-components';

export const Container = styled(View)<{
  commentId: string;
  nested: number;
}>`
  background-color: transparent;
  flex-direction: column;
  margin-left: ${(props) => (props.nested === 1 || props.nested === 2 ? 12 : 22)}px;
  margin-right: 22px;
  padding-top: 0;
  /*  padding-right: 26px;
  padding-left: ${(props) => (props.nested === 1 ? 64 : props.nested === 2 ? 88 : 0)}px;
  */
`;

export const CommentContent = React.memo(styled(Text)`
  color: black;
  font-size: 14px;
  line-height: 14px;
`);

export const Avatar = (props: { source: string }) => {
  return (
    <AvatarMainContainer>
      <AvatarContainer>
        <AvatarPhoto source={props.source} />
      </AvatarContainer>
    </AvatarMainContainer>
  );
};

// was 12
const AvatarMainContainer = styled(View)`
  padding-top: 0;
`;

const AvatarContainer = styled(View)`
  background-color: grey;
  border-radius: 50px;
  height: 28px;
  margin-right: 8px;
  overflow: hidden;
  width: 28px;
`;

const AvatarPhoto = styled(Image).attrs((props) => ({
  resizeMode: 'cover',
  source: { uri: props.source },
}))`
  background-color: grey;
  border-radius: 50px;
  height: 28px;
  margin-right: 8px;
  overflow: hidden;
  width: 28px;
`;

export const CommentImage = styled(Image)`
  background-color: grey;
  border-radius: 3px;
  height: 100px;
  margin-top: 8px;
  overflow: hidden;
  width: 100px;
`;

export const TopRowWrapper = styled(View)<{
  nested: number;
  hasChildren: boolean;
}>`
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  margin-top: 12px;
  margin-left: ${(props) =>
    props.nested === 0 && !props.hasChildren
      ? 0
      : props.hasChildren && props.nested === 0
      ? 0
      : props.hasChildren && props.nested === 1
      ? 38
      : !props.hasChildren && props.nested === 1
      ? 38
      : !props.hasChildren && props.nested === 2
      ? 66
      : 0}px;
`;

export const Content = styled(View)<{
  hasChildren: boolean;
  nested: number;
}>`
  background-color: #eeeeee;
  width: '100%';
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
  margin-left: ${(props) =>
    props.nested === 0 && !props.hasChildren
      ? 0
      : props.hasChildren && props.nested === 0
      ? 28
      : props.hasChildren && props.nested === 1
      ? 66
      : !props.hasChildren && props.nested === 1
      ? 68
      : !props.hasChildren && props.nested === 2
      ? 94
      : 0}px;
  padding-bottom: 12px;
  padding: 16px;
`;

export const InteractionSection = styled(View)<{
  hasChildren: boolean;
  nested: number;
}>`
  background-color: transparent;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
  margin-left: ${(props) =>
    props.nested === 0 && !props.hasChildren
      ? 0
      : props.hasChildren && props.nested === 0
      ? 28
      : props.hasChildren && props.nested === 1
      ? 66
      : !props.hasChildren && props.nested === 1
      ? 68
      : !props.hasChildren && props.nested === 2
      ? 94
      : 0}px;
  padding-bottom: 12px;
  padding: 16px;
  padding-top: 5px;
`;

export const ActionRowLeftBorderInnerSVG = ({ nested, hasChildren }: { nested: number; hasChildren: boolean }) => {
  return (
    <Box
      height="140%"
      width={0.5}
      style={{
        backgroundColor: '#d9d9d9',
        position: 'absolute',
        left:
          nested === 0 && !hasChildren
            ? 0
            : hasChildren && nested === 0
            ? 12
            : hasChildren && nested === 1
            ? 50
            : !hasChildren && nested === 1
            ? 22
            : !hasChildren && nested === 2
            ? 50
            : 0,
      }}
    />
  );
};

export const ActionRowLeftBorderOuterSVG = ({ nested, hasChildren }: { nested: number; hasChildren: boolean }) => {
  return (
    <Box
      height="108%"
      width={0.5}
      style={{
        backgroundColor: '#d9d9d9',
        position: 'absolute',
        left:
          nested === 0 && !hasChildren
            ? 0
            : hasChildren && nested === 0
            ? 12
            : hasChildren && nested === 1
            ? 22
            : !hasChildren && nested === 1
            ? 22
            : !hasChildren && nested === 2
            ? 22
            : 0,
      }}
    />
  );
};

export const ContentLeftBorderInnerSVG = ({ nested, hasChildren }: { nested: number; hasChildren: boolean }) => {
  return (
    <Box
      height="110%"
      width={0.5}
      style={{
        backgroundColor: '#d9d9d9',
        position: 'absolute',
        left:
          nested === 0 && !hasChildren
            ? 0
            : hasChildren && nested === 0
            ? 12
            : hasChildren && nested === 1
            ? 50
            : !hasChildren && nested === 1
            ? 22
            : !hasChildren && nested === 2
            ? 50
            : 0,
      }}
    />
  );
};

export const ContentLeftBorderOuterSVG = ({ nested, hasChildren }: { nested: number; hasChildren: boolean }) => {
  return (
    <Box
      height="108%"
      width={0.5}
      style={{
        backgroundColor: '#d9d9d9',
        position: 'absolute',
        left:
          nested === 0 && !hasChildren
            ? 0
            : hasChildren && nested === 0
            ? 12
            : hasChildren && nested === 1
            ? 22
            : !hasChildren && nested === 1
            ? 22
            : !hasChildren && nested === 2
            ? 22
            : 0,
      }}
    />
  );
};

export const TopRowLeftBorderInnerSVG = ({
  nested,
  hasChildren,
  isLast,
  isParent,
  isLastParent,
}: {
  nested: number;
  hasChildren: boolean;
  isLast: boolean;
  isParent: boolean | undefined;
  isLastParent: boolean | undefined;
}) => {
  return (
    <Box
      height={isLastParent ? '50%' : !isParent && nested === 1 ? '100%' : !isLast ? '100%' : '50%'}
      width={0.5}
      style={{
        backgroundColor: '#d9d9d9',
        position: 'absolute',
        left:
          nested === 0 && !hasChildren
            ? 0
            : hasChildren && nested === 0
            ? 12
            : hasChildren && nested === 1
            ? 22
            : !hasChildren && nested === 1
            ? 22
            : !hasChildren && nested === 2
            ? 50
            : 0,
      }}
    />
  );
};

export const TopRowLeftBorderOuterSVG = ({
  nested,
  hasChildren,
  isLast,
  isLastParent,
}: {
  nested: number;
  hasChildren: boolean;
  isLast: boolean;
  isLastParent: boolean;
}) => {
  return (
    <Box
      height={isLast && nested !== 0 ? '100%' : !isLastParent ? '100%' : '50%'}
      width={0.5}
      style={{
        backgroundColor: '#d9d9d9',
        position: 'absolute',
        left:
          nested === 0 && !hasChildren
            ? 0
            : hasChildren && nested === 0
            ? 12
            : hasChildren && nested === 1
            ? 22
            : !hasChildren && nested === 1
            ? 22
            : !hasChildren && nested === 2
            ? 22
            : 0,
      }}
    />
  );
};

export const HorizontalTierSVG = ({ nested }: { nested: number }) => {
  return (
    <Box
      height={nested !== 1 ? 0.5 : 0.5}
      width={nested === 2 ? 12 : Platform.OS !== 'web' ? 10 : 30}
      style={{
        backgroundColor: '#d9d9d9',
        position: 'absolute',
        left: nested === 1 && Platform.OS !== 'web' ? 24 : 12,
        top: nested !== 1 ? 26 : 24,
      }}
    />
  );
};

export const Name = styled(Text)<{ name: string }>`
  color: black;
  font-size: ${(props: any) => (props?.name?.length > 15 ? 13 : 13)}px;
  font-weight: bold;
`;

export const DateText = styled(Text)`
  color: black;
  font-size: 10px;
  margin-top: 2px;
`;

export const EditedText = styled(Text)`
  color: black;
  font-size: 12px;
  font-style: italic;
  line-height: 12px;
  margin-left: 1px;
  margin-top: 10px;
`;

export const NameRow = styled(View)`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;
