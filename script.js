$(document).ready(function () {
  function recalcTotals() {
    let totalDebit = 0;
    let totalCredit = 0;

    $('input[name="debit[]"]').each(function () {
      const val = parseFloat($(this).val()) || 0;
      totalDebit += val;
    });

    $('input[name="credit[]"]').each(function () {
      const val = parseFloat($(this).val()) || 0;
      totalCredit += val;
    });

    $("#debitTotal").val(totalDebit);
    $("#creditTotal").val(totalCredit);
  }

  $("table").on("input", 'input[name="debit[]"]', function () {
    const $row = $(this).closest("tr");

    if ($(this).val() !== "") {
      $row.find('input[name="credit[]"]').val("0");
    }

    recalcTotals();
  });

  $("table").on("input", 'input[name="credit[]"]', function () {
    const $row = $(this).closest("tr");

    if ($(this).val() !== "") {
      $row.find('input[name="debit[]"]').val("0");
    }
    recalcTotals();
  });

  $("table").on("click", ".addNewRow", function () {
    const $row = $(this).closest("tr");
    const $newRow = $row.clone(true);

    $newRow.find('input[name="debit[]"]').val("");
    $newRow.find('input[name="credit[]"]').val("");
    $newRow.find('textarea[name="notes[]"]').val("");

    $row.after($newRow);
  });

  $("table").on("click", ".cloneRow", function () {
    const $row = $(this).closest("tr");
    const $newRow = $row.clone(true);

    $row.after($newRow);

    recalcTotals();
  });

  $("table").on("click", ".deleteCurrentRow", function () {
    const rowCount = $(this).closest("tbody").find("tr").length;
    if (rowCount > 1) {
      $(this).closest("tr").remove();
      recalcTotals();
    } else {
      alert("You must keep at least one row.");
    }
  });

  /*
      The order for each row:
      1. .accountType (select)
      2. .debit (input)
      3. .credit (input)
      4. .notes (textarea)
      Then skip action buttons and jump to next row's .accountType if it exists.
    */
  $("table").on(
    "keydown",
    "select.accountType, input.debit, input.credit, textarea.notes",
    function (e) {
      if (e.key === "Enter" || e.keyCode === 13) {
        e.preventDefault(); // prevent form submission or default Enter behavior

        const $current = $(this);
        const $row = $current.closest("tr");

        if ($current.hasClass("accountType")) {
          // From accountType -> go to debit
          $row.find("input.debit").focus();
        } else if ($current.hasClass("debit")) {
          // From debit -> go to credit
          $row.find("input.credit").focus();
        } else if ($current.hasClass("credit")) {
          // From credit -> go to notes
          $row.find("textarea.notes").focus();
        } else if ($current.hasClass("notes")) {
          // From notes -> skip actions -> go to next row's accountType
          const $nextRow = $row.next("tr");
          if ($nextRow.length) {
            $nextRow.find("select.accountType").focus();
          } else {
            // If there's no next row, you might want to add one or do nothing
            // e.g. automatically "Add row" and focus it
            // But for now, do nothing or you can call:
            // $('.addNewRow').last().click();
            // $row.next('tr').find('select.accountType').focus();
          }
        }
      }
    }
  );
});
