import React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { useAppSelector } from "@/hooks/useRedux";

interface CashBoxAccordionProps {}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={2} {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, .07)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const CashBoxAccordion: React.FC<CashBoxAccordionProps> = ({}) => {
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const { cashboxState, startSumState } = useAppSelector((state) => state);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <div>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary aria-controls="panel1bh-content" id="panel1bh-header">
          <h3 className="text-xl">Записи</h3>
        </AccordionSummary>
        <AccordionDetails>
          <p>
            Наличные:{" "}
            <span className="font-semibold">{cashboxState.visitsCash}</span>
          </p>
          <p>
            Карта:{" "}
            <span className="font-semibold">{cashboxState.visitsCard}</span>
          </p>
          <p>
            Каспи:{" "}
            <span className="font-semibold">{cashboxState.visitsKaspi}</span>
          </p>
          <p>
            Итого:{" "}
            <span className="font-semibold">{cashboxState.visitsTotal}</span>
          </p>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary aria-controls="panel2bh-content" id="panel2bh-header">
          <h3 className="text-xl">Продажи М</h3>
        </AccordionSummary>
        <AccordionDetails>
          <div className="space-y-4">
            <div className="space-x-2">
              <div className="inline-block">
                Сумма на начало смены:{" "}
                <span className="font-semibold">
                  {startSumState.salesMStartSum}
                </span>
              </div>
              <span>---{">"}</span>
              <div className="inline-block">
                Текущая сумма:{" "}
                <span className="font-semibold">
                  {startSumState.salesMStartSum + cashboxState.salesMenTotal}
                </span>
              </div>
              <div className="inline-block text-neutral-500">
                (
                {startSumState.salesMStartSum +
                  cashboxState.salesMenTotal -
                  startSumState.salesMStartSum}
                )
              </div>
            </div>
            <div>
              <p>
                Наличные:{" "}
                <span className="font-semibold">
                  {cashboxState.salesMenCash}
                </span>
              </p>
              <p>
                Карта:{" "}
                <span className="font-semibold">
                  {cashboxState.salesMenCard}
                </span>
              </p>
              <p>
                Каспи:{" "}
                <span className="font-semibold">
                  {cashboxState.salesMenKaspi}
                </span>
              </p>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary aria-controls="panel3bh-content" id="panel3bh-header">
          <h3 className="text-xl">Краска</h3>
        </AccordionSummary>
        <AccordionDetails>
          <div className="space-y-4">
            <div className="space-x-2">
              <div className="inline-block">
                Сумма на начало смены:{" "}
                <span className="font-semibold">
                  {startSumState.paintStartSum}
                </span>
              </div>
              <span>---{">"}</span>
              <div className="inline-block">
                Текущая сумма:{" "}
                <span className="font-semibold">
                  {startSumState.paintStartSum + cashboxState.paintTotal}
                </span>
              </div>
              <div className="inline-block text-neutral-500">
                (
                {startSumState.paintStartSum +
                  cashboxState.paintTotal -
                  startSumState.paintStartSum}
                )
              </div>
            </div>
            <div>
              <p className="font-semibold">Для услуг:</p>
              {cashboxState.employeeSalaryPaint.length ? (
                cashboxState.employeeSalaryPaint.map((paint) => (
                  <p key={paint.id} className="inline-block pr-2">
                    {paint.employee}:{" "}
                    <span className="font-semibold">{paint.value}</span>,
                  </p>
                ))
              ) : (
                <p>-</p>
              )}
            </div>
            <div>
              <span className="font-semibold">Продажи:</span>
              <p>
                Наличные:{" "}
                <span className="font-semibold">{cashboxState.paintCash}</span>
              </p>
              <p>
                Карта:{" "}
                <span className="font-semibold">{cashboxState.paintCard}</span>
              </p>
              <p>
                Каспи:{" "}
                <span className="font-semibold">{cashboxState.paintKaspi}</span>
              </p>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
      >
        <AccordionSummary aria-controls="panel4bh-content" id="panel4bh-header">
          <h3 className="text-xl">Общая касса</h3>
        </AccordionSummary>
        <AccordionDetails>
          <div className="space-x-2">
            <div className="inline-block">
              Сумма на начало смены:{" "}
              <span className="font-semibold">
                {startSumState.generalShiftStartSum}
              </span>
            </div>
            <span>---{">"}</span>
            <div className="inline-block">
              Текущая сумма:{" "}
              <span className="font-semibold">
                {startSumState.generalShiftStartSum +
                  cashboxState.generalShiftTotal}
              </span>
            </div>
            <div className="inline-block text-neutral-500">
              (
              {startSumState.generalShiftStartSum +
                cashboxState.generalShiftTotal -
                startSumState.generalShiftStartSum}
              )
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default CashBoxAccordion;
