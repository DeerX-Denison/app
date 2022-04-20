import tw from '@tw';
import React, { FC } from 'react';
import { Text } from 'react-native';
import { MessageBlockContent } from 'types';

interface Props {
	content: MessageBlockContent;
}

const TextContent: FC<Props> = ({ content }) => {
	return (
		<Text style={tw('text-s-md text-gray')}>
			{'refs' in content && content.refs
				? content.refs.length > 0
					? content.refs.length === 1
						? content.refs.map((_item, index) => {
								return (
									<Text key={index}>
										<Text>
											{content.content.slice(0, content.refs[index].begin)}
										</Text>
										<Text style={tw('font-bold')}>
											{content.content.slice(
												content.refs[index].begin,
												content.refs[index].end + 1
											)}
										</Text>
										<Text>
											{content.content.slice(content.refs[index].end + 1)}
										</Text>
									</Text>
								);
								// eslint-disable-next-line no-mixed-spaces-and-tabs
						  })
						: content.refs.map((_item, index) => {
								if (index === content.refs.length - 1) {
									return (
										<Text key={index}>
											<Text>
												{content.content.slice(
													content.refs[index - 1].end + 1,
													content.refs[index].begin
												)}
											</Text>
											<Text style={tw('font-bold')}>
												{content.content.slice(
													content.refs[index].begin,
													content.refs[index].end + 1
												)}
											</Text>
											<Text>
												{content.content.slice(content.refs[index].end + 1)}
											</Text>
										</Text>
									);
								} else if (index === 0) {
									return (
										<Text key={index}>
											<Text>
												{content.content.slice(0, content.refs[index].begin)}
											</Text>
											<Text style={tw('font-bold')}>
												{content.content.slice(
													content.refs[index].begin,
													content.refs[index].end + 1
												)}
											</Text>
										</Text>
									);
								} else {
									return (
										<Text key={index}>
											<Text>
												{content.content.slice(
													content.refs[index - 1].end + 1,
													content.refs[index].begin
												)}
											</Text>
											<Text style={tw('font-bold')}>
												{content.content.slice(
													content.refs[index].begin,
													content.refs[index].end + 1
												)}
											</Text>
										</Text>
									);
								}
								// eslint-disable-next-line no-mixed-spaces-and-tabs
						  })
					: content.content
				: content.content}
		</Text>
	);
};
export default TextContent;
