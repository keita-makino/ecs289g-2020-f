import { ActionButton, Flex } from '@adobe/react-spectrum';
import { gql, useMutation, useReactiveVar } from '@apollo/client';
import EditIn from '@spectrum-icons/workflow/EditIn';
import PlayCircle from '@spectrum-icons/workflow/PlayCircle';
import React from 'react';
import { isEditingVar, isLoadingVar } from '../../localState';

export type EditButtonProps = {
  text?: string;
  id?: string;
};

const mutation = gql`
  mutation UPDATE_QUESTION(
    $id: String!
    $newName: StringFieldUpdateOperationsInput!
  ) {
    updateOneQuestion(where: { id: $id }, data: { name: $newName }) {
      id
    }
  }
`;

export const EditButton: React.FC<EditButtonProps> = (props) => {
  const isEditing = useReactiveVar(isEditingVar)['questionTitle'];
  const [changeName] = useMutation(mutation);

  return (
    <Flex height={'100%'} alignItems={'center'}>
      <ActionButton
        isQuiet
        UNSAFE_style={{ cursor: 'pointer' }}
        onPressEnd={() => {
          if (isEditing) {
            isLoadingVar({ ...isLoadingVar(), questionTitle: true });
            changeName({
              variables: {
                id: props.id,
                newName: { set: props.text },
              },
            }).then((data) => {
              isEditingVar({ ...isEditingVar(), questionTitle: false });
            });
          } else {
            isEditingVar({ ...isEditingVar(), questionTitle: true });
          }
        }}
      >
        {isEditing ? (
          <PlayCircle aria-label={'PlayCircle'} size={'M'} />
        ) : (
          <EditIn aria-label={'EditIn'} size={'S'} />
        )}
      </ActionButton>
    </Flex>
  );
};
