import React from 'react';
import ERBottomSheet, { ERBottomSheetRef } from '@/components/common/ERBottomSheet/ERBottomSheet';
import ERIntegerKeypad from '@/components/common/ERKeyPad/ERIntegerKeypad';
import ERDecimalKeypad from '@/components/common/ERKeyPad/ERDecimalKeypad';
import ERDurationKeypad from '@/components/common/ERKeyPad/ERDurationKeypad';
import { InputKind } from '@/hooks/feature/useSetUpdateBottomSheet';

type SetUpdateBottomSheetProps = {
  bottomSheetRef: React.RefObject<ERBottomSheetRef>;
  inputKind: InputKind | null;
  defaultValue: string;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: (nextValue: string) => void;
};

const SetUpdateBottomSheet: React.FC<SetUpdateBottomSheetProps> = ({
  bottomSheetRef,
  inputKind,
  defaultValue,
  onClose,
  onCancel,
  onConfirm,
}) => {
  return (
    <ERBottomSheet ref={bottomSheetRef} snapPoints={['45%']} onClose={onClose}>
      {inputKind === 'integer' && (
        <ERIntegerKeypad
          defaultValue={defaultValue}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      )}

      {inputKind === 'decimal' && (
        <ERDecimalKeypad
          defaultValue={defaultValue}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      )}

      {inputKind === 'duration' && (
        <ERDurationKeypad
          defaultValue={defaultValue}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      )}
    </ERBottomSheet>
  );
};

export default SetUpdateBottomSheet;
export type { SetUpdateBottomSheetProps };
