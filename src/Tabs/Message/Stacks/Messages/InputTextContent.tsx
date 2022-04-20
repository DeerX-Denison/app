import tw from '@tw';
import React, { FC } from 'react';
import { Text } from 'react-native';
import { InputTextRef } from 'types';

interface Props {
	refs: InputTextRef[];
	inputText: string;
}

const InputTextContent: FC<Props> = ({ refs, inputText }) => {
	return (
		<Text>
			{refs.length > 0
				? refs.length === 1
					? refs.map((item, index) => {
							return (
								<Text key={index}>
									<Text>{inputText.slice(0, refs[index].begin)}</Text>
									<Text style={tw('font-bold')}>
										{inputText.slice(refs[index].begin, refs[index].end + 1)}
									</Text>
									<Text>{inputText.slice(refs[index].end + 1)}</Text>
								</Text>
							);
							// eslint-disable-next-line no-mixed-spaces-and-tabs
					  })
					: refs.map((item, index) => {
							if (index === refs.length - 1) {
								return (
									<Text key={index}>
										<Text>
											{inputText.slice(
												refs[index - 1].end + 1,
												refs[index].begin
											)}
										</Text>
										<Text style={tw('font-bold')}>
											{inputText.slice(refs[index].begin, refs[index].end + 1)}
										</Text>
										<Text>{inputText.slice(refs[index].end + 1)}</Text>
									</Text>
								);
							} else if (index === 0) {
								return (
									<Text key={index}>
										<Text>{inputText.slice(0, refs[index].begin)}</Text>
										<Text style={tw('font-bold')}>
											{inputText.slice(refs[index].begin, refs[index].end + 1)}
										</Text>
									</Text>
								);
							} else {
								return (
									<Text key={index}>
										<Text>
											{inputText.slice(
												refs[index - 1].end + 1,
												refs[index].begin
											)}
										</Text>
										<Text style={tw('font-bold')}>
											{inputText.slice(refs[index].begin, refs[index].end + 1)}
										</Text>
									</Text>
								);
							}
							// eslint-disable-next-line no-mixed-spaces-and-tabs
					  })
				: inputText}
		</Text>
	);
};

export default InputTextContent;
