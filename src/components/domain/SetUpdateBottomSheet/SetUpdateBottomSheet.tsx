import React from 'react';
import ERBottomSheet, { ERBottomSheetRef } from '@/components/ui/ERBottomSheet/ERBottomSheet';
import ERIntegerKeypad from '@/components/ui/ERKeyPad/ERIntegerKeypad';
import ERDecimalKeypad from '@/components/ui/ERKeyPad/ERDecimalKeypad';
import ERDurationKeypad from '@/components/ui/ERKeyPad/ERDurationKeypad';
import { InputKind } from '@/hooks/useSetUpdateBottomSheet';

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
