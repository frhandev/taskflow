"use client";
import { useState } from "react";
import Modal from "./Modal";
import Icon from "./Icon";
export default function ConfirmDialog({
  heading,
  text,
  button,
  onConfirm,
  onClose,
}: {
  heading: string;
  text: string;
  button: string;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <Modal
      titleId="confirm-title"
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <div className="modal-top">
        <span className="modal-danger">
          <Icon name="trash" />
        </span>
        <button
          className="icon-button"
          onClick={onClose}
          disabled={busy}
          aria-label="Close"
        >
          <Icon name="close" />
        </button>
      </div>
      <h2 id="confirm-title">{heading}</h2>
      <p className="modal-sub">{text}</p>
      <div className="modal-footer">
        <button className="button" onClick={onClose} disabled={busy}>
          Cancel
        </button>
        <button
          className="button coral"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await onConfirm();
              onClose();
            } catch {
              setBusy(false);
            }
          }}
        >
          {button}
        </button>
      </div>
    </Modal>
  );
}
